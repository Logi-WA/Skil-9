import { getLaunch, searchLaunches } from './api.js';
import { el } from './elements.js';

/**
 * Býr til leitarform.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarstrengur.
 * @returns {HTMLElement} Leitarform.
 */
export function renderSearchForm(searchHandler, query = undefined) {
  const form = el(
    'form',
    { class: 'search-form' },
    el('input', {
      value: query ?? '',
      name: 'query',
      class: 'search-box',
      placeholder: 'Leitarorð',
    }),
    el('button', { class: 'search-btn' }, 'Leita'),
  );

  form.addEventListener('submit', searchHandler);

  return form;
}

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(parentElement, searchForm = undefined) {
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }

  if (!searchForm) {
    return;
  }

  const button = searchForm.querySelector('button');

  if (button) {
    button.setAttribute('disabled', 'disabled');
  }
}

/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(parentElement, searchForm = undefined) {
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }

  if (!searchForm) {
    return;
  }

  const disabledButton = searchForm.querySelector('button[disabled]');

  if (disabledButton) {
    disabledButton.removeAttribute('disabled');
  }
}

/**
 * Birta niðurstöður úr leit.
 * @param {import('./api.types.js').Launch[] | null} results Niðurstöður úr leit
 * @param {string} query Leitarstrengur.
 */
function createSearchResults(results, query) {
  const resultsElement = el('div', { class: 'results' });
  const tableElement = el('table', {});

  if (!results) {
    const noResultElement = el(
      'p',
      { class: 'info' },
      `Villa við leit að ${query}`,
    );
    resultsElement.appendChild(noResultElement);
    return resultsElement;
  }

  if (results.length === 0) {
    const noResultElement = el(
      'p',
      { class: 'info' },
      `Engar niðurstöður fyrir leit að ${query}`,
    );
    resultsElement.appendChild(noResultElement);
    return resultsElement;
  }

  for (const result of results) {
    try {
      const nameElement = el(
        'a',
        { href: `/?id=${result.id}` },
        result.name ?? '_no_name_',
      );
      const columnElement = el(
        'td',
        { class: 'result' },
        el('h2', { class: 'name' }, nameElement),
        el(
          'p',
          { class: 'status' },
          '🚀 ',
          result.status?.name ?? '_no_status_name_',
        ),
        el(
          'p',
          { class: 'mission' },
          el('strong', {}, 'Geimferð: '),
          result.mission ?? '_no_mission_',
        ),
      );
      const rowElement = el('tr');
      rowElement.appendChild(columnElement);
      tableElement.appendChild(rowElement);
    } catch (e) {
      console.error('Villa kom upp við birtingu ', result, e);
    }
  }
  resultsElement.appendChild(tableElement);

  return resultsElement;
}

/**
 *
 * @param {HTMLElement} parentElement Element sem á að birta niðurstöður í.
 * @param {Element} searchForm Form sem á að gera óvirkt.
 * @param {string} query Leitarstrengur.
 */
export async function searchAndRender(parentElement, searchForm, query) {
  const mainElement = parentElement.querySelector('main');

  if (!mainElement) {
    console.warn('Fann ekki <main> element');
    return;
  }

  const resultsElement = mainElement.querySelector('.results');
  if (resultsElement) {
    resultsElement.remove();
  }

  setLoading(mainElement, searchForm);
  const results = await searchLaunches(query);
  setNotLoading(mainElement, searchForm);

  const resultsEl = createSearchResults(results, query);

  mainElement.appendChild(resultsEl);
}

/**
 * Sýna forsíðu, hugsanlega með leitarniðurstöðum.
 * @param {HTMLElement} parentElement Element sem á að innihalda forsíðu.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarorð, ef eitthvað, til að sýna niðurstöður fyrir.
 */
export function renderFrontpage(
  parentElement,
  searchHandler,
  query = undefined,
) {
  const heading = el(
    'h1',
    { class: 'heading', 'data-foo': 'bar' },
    'Geimskotaleitin 🚀',
  );
  const searchForm = renderSearchForm(searchHandler, query);
  const container = el('main', {}, heading, searchForm);
  parentElement.appendChild(container);

  if (!query) {
    return;
  }

  searchAndRender(parentElement, searchForm, query);
}

/**
 * Sýna geimskot.
 * @param {HTMLElement} parentElement Element sem á að innihalda geimskot.
 * @param {string} id Auðkenni geimskots.
 */
export async function renderDetails(parentElement, id) {
  const container = el('main', {});
  parentElement.appendChild(container);
  setLoading(container);
  const result = await getLaunch(id);
  setNotLoading(container);

  // Tómt og villu state, við gerum ekki greinarmun á þessu tvennu, ef við
  // myndum vilja gera það þyrftum við að skilgreina stöðu fyrir niðurstöðu
  if (!result) {
    const noResultElement = el(
      'p',
      { class: 'info' },
      'Villa við að sækja geimskot',
    );
    container.appendChild(noResultElement);
    return;
  }

  const nameElement = el('h1', {}, result.name ?? '_no_name_');
  container.appendChild(nameElement);

  const windowStartElement = el(
    'p',
    {},
    'Gluggi opnast: ',
    result.window_start ?? '_no_window_start_',
  );
  const windowEndElement = el(
    'p',
    {},
    'Gluggi lokast: ',
    result.window_end ?? '_no_window_end_',
  );
  container.appendChild(windowStartElement);
  container.appendChild(windowEndElement);

  const statusNameElement = el(
    'h2',
    {},
    'Staða: ',
    result.status?.name ?? '_no_status_name_',
  );
  const statusDescriptionElement = el(
    'p',
    {},
    result.status?.description ?? '_no_status_description_',
  );
  container.appendChild(statusNameElement);
  container.appendChild(statusDescriptionElement);

  const missionNameElement = el(
    'h2',
    {},
    'Geimferð: ',
    result.mission?.name ?? '_no_mission_name_',
  );
  const missionDescriptionElement = el(
    'p',
    {},
    result.mission?.description ?? '_no_mission_description_',
  );
  container.appendChild(missionNameElement);
  container.appendChild(missionDescriptionElement);

  const imageElement = el('img', { src: result.image ?? '' });
  container.appendChild(imageElement);

  const backElement = el(
    'div',
    { class: 'back' },
    el('a', { href: '', onclick: 'window.history.back()' }, 'Til baka'),
  );
  container.appendChild(backElement);
}
