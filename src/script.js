import { filmsMock } from './filmsMock.js'

const ALL_FILMS = 'all_films'
const FAVOURITE_FILMS = 'favourite_films'

// Инициализация localStorage;

if (!fromStorage(ALL_FILMS) && !fromStorage(FAVOURITE_FILMS)) {
    toStorage(ALL_FILMS, filmsMock)
    toStorage(FAVOURITE_FILMS, [])
}

// Рисуем список фильмов

const storagedFilms = fromStorage(ALL_FILMS)

renderFilmList(storagedFilms, ALL_FILMS)

// Логика переключения разделов Все фильмы/Избранные фильмы

const favouriteFilmsBtn = document.querySelector('.film-cards-container__favourite-films')

favouriteFilmsBtn.addEventListener('click', () => handleFilmsListSwitch(favouriteFilmsBtn))

// ==========================

function toStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function fromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

// Функция рендера списка фильмов

function renderFilmList(filmsList, listType) {
    const favouriteFilmsBtnHTML = document.querySelector('.film-cards-container__favourite-films')

    favouriteFilmsBtnHTML.insertAdjacentHTML(
        'afterend',
        `<div id="${listType}" class="film-cards-container"></div>`
    )

    const filmsContainer = document.querySelector('.film-cards-container')

    // Рисуем список фильмов

    if (filmsList.length) {
        filmsList.forEach(film => renderFilmCard(film, filmsContainer))
    } else {
        filmsContainer.innerHTML = '<div>Список пуст</div>'
    }

    // Слушатели кликов по кнопке добавления в избранное

    const likeBtns = document.querySelectorAll('.film-card__button')
    likeBtns.forEach((btn, i) => btn.addEventListener('click', () => handleLikeBtnClick(filmsList, listType, i)))

    // Слушатели открытия модального окна

    const filmsTitles = document.querySelectorAll('.film-card__title')
    filmsTitles.forEach((title, i) => title.addEventListener('click', () => {
        const clickedFilm = filmsList[i]
        renderFilmModal(clickedFilm, filmsContainer)

        const closeModalBtn = document.querySelector('.close-modal')
        closeModalBtn.addEventListener('click', () => {
            const modal = document.querySelector('.modal')
            modal.remove()
        },
            { once: true }) // 3 параметр обработчика событий; такая запись удаляет обработчик событий ({ once: true })
    }))
}

// Функция отрисовки карточки фильма

function renderFilmCard(film, targetContainer) {
    const { imgUrl, movieName, releaseYear, isFavourite } = film

    const btnImg = isFavourite ? 'favourite.png' : 'notFavourite.png'

    targetContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="film-card">
                <img class="film-card__poster" src="${imgUrl}">
                <div class="film-card__title">${movieName}</div>
                <div class="film-card__year">${releaseYear}</div>
                <button class="film-card__button">
                    <img class="film-card__button-img" src="./assets/img/${btnImg}">
                </button>
             </div>`
    )
}

function renderFilmModal(clickedFilm, targetContainer) {
    const { imgUrl, movieName, releaseYear, isFavourite, description } = clickedFilm
    const btnImg = isFavourite ? 'favourite.png' : 'notFavourite.png'

    targetContainer.insertAdjacentHTML(
        'afterend', `
            <div class="modal">
                <div class="modal-content">
                    <div class="close-modal">
                        <img class="close-modal-icon" src="./assets/img/cross.png">
                    </div>
                    
                    <img class="film-card__poster" src="${imgUrl}">
                    <div class="film-card__title">${movieName}</div>
                    <div class="film-card__year">${releaseYear}</div>
                    <div class="film-card__description">${description}</div>
                    <button class="film-card__button">
                    <img class="film-card__button-img" src="./assets/img/${btnImg}">
                    </button>
                </div>
            </div>
    `)
}

// Функция обработчик для кнопки добавления в избранное

function handleLikeBtnClick(filmsList, listType, i){
    filmsList[i].isFavourite = !filmsList[i].isFavourite // Присвоение противоположного значения

    const sortedFilmsList = sortByIsFavourite(filmsList)
    const sortedFavouriteFilmsList = sortFavouriteFilmsList(sortedFilmsList)

    const filmsListContainer = document.getElementById(listType)

    switch (listType) {
        case ALL_FILMS :
            toStorage(ALL_FILMS, sortedFilmsList)
            toStorage(FAVOURITE_FILMS, sortedFavouriteFilmsList)

            filmsListContainer.remove()
            renderFilmList(sortedFilmsList, listType)
            break
        case FAVOURITE_FILMS :
            const newAllFilmsList = storagedFilms
            newAllFilmsList[i].isFavourite = !newAllFilmsList[i].isFavourite

            toStorage(ALL_FILMS, sortByIsFavourite(newAllFilmsList))
            toStorage(FAVOURITE_FILMS, sortedFavouriteFilmsList)

            filmsListContainer.remove()
            renderFilmList(sortedFavouriteFilmsList, listType)
            break
        default :
            break
    }
}

// Функция сортировки

function sortByIsFavourite(films) {
    return films.sort((a, b) => a.id - b.id).sort(a => a.isFavourite ? -1 : 1) // -1 - начало списка, 1 -конец списка
}

function sortFavouriteFilmsList(films) {
    return films.filter(film => film.isFavourite).sort((a, b) => b.id - a.id)
}

// Свичер списка

function handleFilmsListSwitch(switcherBtn) {
    const filmsContainer = document.querySelector('.film-cards-container')

    const filmsCardContainerTitle = document.querySelector('.film-card-container__title')
    console.log(filmsCardContainerTitle)

    switch (filmsContainer.id) {
        case ALL_FILMS:
            filmsContainer.remove()
            filmsCardContainerTitle.innerHTML = 'Favourite Films'
            switcherBtn.innerHTML = 'See All Films'
            renderFilmList(fromStorage(FAVOURITE_FILMS), FAVOURITE_FILMS)
            break
        case FAVOURITE_FILMS:
            filmsContainer.remove()
            filmsCardContainerTitle.innerHTML = 'All Films'
            switcherBtn.innerHTML = 'See Favourite Films'
            renderFilmList(storagedFilms, ALL_FILMS)
            break
        default:
            break
    }
}

