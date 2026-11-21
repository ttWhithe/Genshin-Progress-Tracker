import { useEffect } from 'react';

export function useDynamicFavicon(element?: string) {
  useEffect(() => {
    // Находим тег <link rel="icon"> в <head>
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    // Если тега нет (на всякий случай), создаем его
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Путь к стандартной иконке
    const defaultIcon = '/favicon.svg';

    if (element) {
      // Если стихия известна, ставим SVG стихии
      // Предполагается, что файлы называются pyro.svg, hydro.svg и т.д.
      link.href = `/icons/elements/${element}.svg`;
    } else {
      // Если стихии нет (или персонаж не выбран), ставим стандартную
      link.href = defaultIcon;
    }

    // ВАЖНО: Функция очистки.
    // Когда вы уйдете со страницы персонажа на другую вкладку/страницу,
    // иконка вернется к стандартной.
    return () => {
      link.href = defaultIcon;
    };
  }, [element]); // Хук сработает заново, если стихия изменится
}
