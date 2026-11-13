import re
import subprocess
import sys
import logging
import json
import os
import time
import threading
from pathlib import Path
from PIL import Image
from collections import Counter

# ==========================================
# НАСТРОЙКИ СКРИПТА
# ==========================================
BOARD_URL = "https://ru.pinterest.com/yen_123412/icon-hoyoverse/genshin-impact/"
RESIZE_IMAGES = True
TARGET_SIZE = 256
WARN_NON_SQUARE = True

# Пути
BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "data" / "raw_gallery"
RESIZED_DIR = BASE_DIR / "data" / "pinterest_256"
LOG_FILE = BASE_DIR / "parser.log"
JSON_FILE = BASE_DIR / "downloaded_ids.json"
# ==========================================

# Настраиваем логирование
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE, mode='w', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
log = logging.getLogger(__name__)

COLOR_BLUE = '\033[94m'
COLOR_YELLOW = '\033[93m'
COLOR_GREEN = '\033[92m'
COLOR_CYAN = '\033[96m'
COLOR_RESET = '\033[0m'

# --- Таймер ---
stop_timer = False

def timer_thread():
    """Поток, который тикает каждую секунду, пока идет скачивание."""
    seconds = 0
    while not stop_timer:
        mins, secs = divmod(seconds, 60)
        time_str = f"{mins:02d}:{secs:02d}"
        # Выводим в одну строку с возвратом каретки (\r), чтобы не засорять консоль
        sys.stdout.write(f"\r{COLOR_BLUE}⏳ Выполняется запрос к Pinterest... [{time_str}]{COLOR_RESET}")
        sys.stdout.flush()
        time.sleep(1)
        seconds += 1
    # Очищаем строку после завершения
    sys.stdout.write("\r" + " " * 50 + "\r")
    sys.stdout.flush()

def clean_filename(name: str) -> str:
    name = re.sub(r'^\d+_', '', name)
    name = re.sub(r'^[^\w]+|[^\w]+$', '', name).strip()
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    return name[:100] if name else "untitled_icon"

def download_with_gallery_dl():
    global stop_timer
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    log.info(f"⏳ Шаг 1: Скачиваем изображения через gallery-dl...")

    command = [
        sys.executable, "-m", "gallery_dl",
        "-d", str(RAW_DIR),
        "-o", "filename={id}_{title}.{extension}",
        "-o", "directory=[]",
        "--sleep", "3-10",
        BOARD_URL
    ]

    # Запускаем таймер в фоновом режиме
    stop_timer = False
    t = threading.Thread(target=timer_thread)
    t.daemon = True
    t.start()

    try:
        # Запускаем gallery-dl без подавления вывода
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            env={**os.environ, "PYTHONUNBUFFERED": "1"} # Принудительно отключаем буферизацию
        )

        # Читаем вывод построчно
        for line in iter(process.stdout.readline, ''):
            clean_line = line.strip()
            if clean_line:
                # Стираем таймер, пишем лог, и запускаем таймер заново на новой строке
                sys.stdout.write("\r" + " " * 50 + "\r")
                log.info(clean_line)

        process.wait()

        # Останавливаем таймер
        stop_timer = True
        t.join()

        if process.returncode == 0:
            log.info("✅ Шаг 1 завершен (Скачивание).")
        else:
            log.error("❌ Ошибка при скачивании gallery-dl.")
            sys.exit(1)

    except Exception as e:
        stop_timer = True
        log.error(f"❌ Ошибка gallery-dl: {e}")
        sys.exit(1)

def process_images():
    if not RESIZE_IMAGES:
        log.info(f"\n⏭️ Шаг 2 ПРОПУЩЕН (в настройках RESIZE_IMAGES = False). Оригиналы лежат в {RAW_DIR}")
        return

    RESIZED_DIR.mkdir(parents=True, exist_ok=True)
    log.info(f"\n🖼️ Шаг 2: Обрабатываем до {TARGET_SIZE}x{TARGET_SIZE}...")

    processed_ids = set()
    if JSON_FILE.exists():
        try:
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                processed_ids = set(json.load(f))
        except Exception as e:
            log.warning(f"⚠️ Не удалось прочитать {JSON_FILE.name}: {e}")

    files = [f for f in RAW_DIR.rglob("*") if f.is_file() and f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp')]
    total = len(files)

    if total == 0:
        log.info("⚠️ Нет новых картинок для обработки.")
        return

    processed_count = 0
    skipped_count = 0
    non_square_count = 0
    ext_counter = Counter()
    new_ids = []

    for index, filepath in enumerate(files, start=1):
        try:
            match = re.match(r'^(\d+)_', filepath.stem)
            if match:
                file_id = match.group(1)
                if file_id in processed_ids:
                    log.info(f"[{index}/{total}] {filepath.name} -> ID уже есть в JSON, пропускаем.")
                    skipped_count += 1
                    continue
            else:
                file_id = None

            ext_counter[filepath.suffix.lower()] += 1
            cleaned_name = clean_filename(filepath.stem)
            new_filename = f"{cleaned_name}.png"
            new_filepath = RESIZED_DIR / new_filename

            counter = 1
            while new_filepath.exists():
                new_filename = f"{cleaned_name}_{counter}.png"
                new_filepath = RESIZED_DIR / new_filename
                counter += 1

            with Image.open(filepath) as img:
                is_square = (img.width == img.height)
                if not is_square:
                    non_square_count += 1
                    if WARN_NON_SQUARE:
                        log.warning(f"{COLOR_YELLOW}[{index}/{total}] ВНИМАНИЕ: Не квадратная ({img.width}x{img.height}) -> {filepath.name}{COLOR_RESET}")
                else:
                    log.info(f"[{index}/{total}] {filepath.name} ==> {new_filename}")

                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')

                img.thumbnail((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)
                img.save(new_filepath, "PNG")

            processed_count += 1
            if file_id:
                new_ids.append(file_id)

        except Exception as e:
            log.error(f"[{index}/{total}] ⚠️ Ошибка с {filepath.name}: {e}")

    if new_ids:
        processed_ids.update(new_ids)
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(list(processed_ids), f, indent=4, ensure_ascii=False)
        log.info(f"💾 ID сохранены в {JSON_FILE.name}")

    log.info(f"\n{COLOR_CYAN}========================================={COLOR_RESET}")
    log.info(f"{COLOR_GREEN}✅ Шаг 2 завершен. Статистика:{COLOR_RESET}")
    log.info(f"   Обработано новых: {processed_count}")
    log.info(f"   Пропущено (уже в JSON): {skipped_count}")
    if non_square_count > 0:
        log.info(f"   {COLOR_YELLOW}Из них НЕ квадратных: {non_square_count} (проверьте их вручную){COLOR_RESET}")
    log.info(f"   Форматы исходников: " + ", ".join([f"{ext}: {count}" for ext, count in ext_counter.items()]))
    log.info(f"{COLOR_CYAN}========================================={COLOR_RESET}")

def main():
    log.info("🚀 Запуск парсера...")
    download_with_gallery_dl()
    process_images()
    log.info(f"\n✨ Готово! Все логи сохранены в {LOG_FILE.name}")

if __name__ == "__main__":
    main()
