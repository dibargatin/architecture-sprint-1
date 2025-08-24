## Задача 1

Необходимо разделить проект Mesto на несколько микрофронтендов. Самостоятельно решите, какой фреймворк будете использовать, — Module Federation или Single SPA.

> [!NOTE] Важно!
> Третий опциональный уровень задания проверять не требуется.

### Анализ проекта
#### Структура проекта

- `public` — статические ресурсы, включая `index.html`
- `src` — исходный код веб-приложения
	- `blocks` — каскадные таблицы стилей компонентов
	- `components` — React-компоненты
	- `contexts/CurrentUserContext` — объект React-контекста для хранения информации из профиля текущего пользователя
	- `images` — иконки и другие изображения используемые в приложении
	- `utils` — модули реализующие функции вызова API сервера приложений
	- `vendor` — шрифты и общие таблицы стилей

#### Компоненты и модули

```mermaid 
classDiagram
	direction LR
	%%index --> App: use
	class App {
		isEditProfilePopupOpen: bool
		isAddPlacePopupOpen: bool
		isEditAvatarPopupOpen: bool
		selectedCard: object
		cards: object[0..*]
		currentUser: object
		isInfoToolTipOpen: bool
		tooltipStatus: string
		isLoggedIn: bool
		email: string
		
		handleEditProfileClick()
		handleAddPlaceClick()
		handleEditAvatarClick()
		closeAllPopups()
		handleCardClick(card)
		handleUpdateUser(userUpdate)
		handleUpdateAvatar(avatarUpdate)
		handleCardLike(card)
		handleCardDelete(card)
		handleAddPlaceSubmit(newCard)
		onRegister(email, password)
		onLogin(email, password)
		onSignOut()
	}
	App --> CurrentUserContext: create
	App --> Api: use
	App --> Auth: use
	App --> LocalStorage: use
	App --> Header: use
	App --> ProtectedRoute: use
	ProtectedRoute .. Main: "/"
	App --> Main: use
	App --> Route: use	
	Route .. Register: "/signup"	
	App --> Register: use
	Route .. Login: "/signin"
	App --> Login: use
	App --> Footer: use
	App --> EditProfilePopup: use
	App --> AddPlacePopup: use
	App --> PopupWithForm: use
	App --> EditAvatarPopup: use
	App --> ImagePopup: use
	App --> InfoTooltip: use	
	class CurrentUserContext {
		name: string
		about: string
		avatar: string
		email: string
		password: string
	}
	class Api {
		address: string
		groupId: string
		token: string
		getAppInfo()
		getCardList()
		addCard(name, link)
		removeCard(cardId)
		getUserInfo()
		setUserInfo(name, about)
		setUserAvatar(avatar)
		changeLikeCardStatus(cardId, like)
	}
	class Auth {
		register(email, password)
		login(email, password)
		checkToken(token)
	}
	Auth --> LocalStorage: use
	class LocalStorage {
		jwt: string
	}
	class Header {
		onSignOut: function
		email: string
	}
	class Main {
		cards: object[0..*] 
		onEditProfile: function
		onAddPlace: function
		onEditAvatar: function
		onCardClick: function
		onCardLike: function
		onCardDelete: function
	}
	Main --> CurrentUserContext: use
	Main --> Card: use
	class Card {
		card: object 
		onCardClick: function 
		onCardLike: function
		onCardDelete: function
		handleClick()
		handleLikeClick()
		handleDeleteClick()
	}
	Card --> CurrentUserContext: use
	class EditProfilePopup {		
		+isOpen: bool		
		+onUpdateUser: function
		+onClose: function
		name: string
		description: string
		handleNameChange()
		handleDescriptionChange()
		handleSubmit(e)
	}
	EditProfilePopup --> CurrentUserContext: use
	EditProfilePopup --> PopupWithForm: use
	class AddPlacePopup {
		+isOpen: bool
		+onAddPlace: function
		+onClose: function
		name: string
		link: string
		handleNameChange(e)
		handleLinkChange(e)
		handleSubmit(e)		
	}
	AddPlacePopup --> PopupWithForm: use
	class PopupWithForm {
		+title: string
		+name: string
		+isOpen: bool
		+buttonText: string
		+onSubmit: function
		+onClose: function
		+children: any
	}
	class EditAvatarPopup {
		+isOpen: bool 
		+onUpdateAvatar: function 
		+onClose: function
		handleSubmit(e)
	}
	EditAvatarPopup --> PopupWithForm: use
	class ImagePopup {
		+card: object
		+onClose: function
	}
	class InfoTooltip {
		+isOpen: bool
		+onClose: function
		+status: string
		icon
		text
	}
	class Register {
		+onRegister: function
		email: string
		password: string
		handleSubmit(e)
	}
	class Login {
		+onLogin: function
		email: string
		password: string
		handleSubmit(e)
	}
```

#### Маршрутизация

```mermaid
flowchart TD
	Header -.-> SignUpRoute
	Header -.-> SignInRoute
	Header -.-> RootRoute
	SignUpRoute@{ shape: stadium, label: "/signup" }
	SignUpRoute --> Register
	Register -.-> SignInRoute
	SignInRoute@{ shape: stadium, label: "/signin" }
	SignInRoute --> Login
	ProtectedRoute -.-> SignInRoute
	ProtectedRoute --> Main
	RootRoute@{ shape: stadium, label: "/" }
	RootRoute --> Main
```
#### Зависимости проекта

- react 17.0.2
- react-dom 17.0.2
	- index.js
- react-router-dom 5.2.0
	- index.js
	- App.js
	- Header.js
	- ProtectedRoute.js
	- Register.js
- react-scripts 4.0.3
- web-vitals 1.0.1 — не используется

#### Утилиты и вспомогательные функции

```mermaid
classDiagram
	class App {
		handleUpdateUser(userUpdate)
		handleUpdateAvatar(avatarUpdate)
		handleCardLike(card)
		handleCardDelete(card)
		handleAddPlaceSubmit(newCard)
		onRegister(email, password)
		onLogin(email, password)
	}
	App --> Api: use
	App --> Auth: use
	class Api {
		address: string
		groupId: string
		token: string
		getAppInfo()
		getCardList()
		addCard(name, link)
		removeCard(cardId)
		getUserInfo()
		setUserInfo(name, about)
		setUserAvatar(avatar)
		changeLikeCardStatus(cardId, like)
	}
	class Auth {
		register(email, password)
		login(email, password)
		checkToken(token)
	}
```
#### Стили и их организация

```mermaid
classDiagram
	direction LR
	class index.css {
		<<file>>
	}
	index.css --> normalize.css: use
	index.css --> font.css: use
	index.css --> page.css: use
	index.css --> header.css: use
	index.css --> content.css: use
	index.css --> footer.css: use
	index.css --> profile.css: use
	index.css --> places.css: use
	index.css --> card.css: use
	index.css --> popup.css: use
	index.css --> popup_is-opened.css: use
	index.css --> auth-form.css: use
	class normalize.css {
		<<file>>
	}
	class font.css {
		<<file>>
	}
	class page.css {
		<<file>>
		page
		page__content
		page__section
	}
	page.css ..> App
	page.css ..> Footer
	page.css ..> Header
	page.css ..> Main
	class header.css {
		<<file>>
		header
		header__logo
		header__auth-link
		header__wrapper
		header__user
		header__logout
	}
	header.css ..> Header
	class content.css {
		<<file>>
		content
	}
	content.css ..> Main
	class footer.css {
		<<file>>
		footer
		footer__copyright
	}
	footer.css ..> Footer
	class profile.css {
		<<file>>
		profile
		profile__description
		profile__add-button
		profile__edit-button
		profile__info
		profile__title
		profile__image
	}
	profile.css ..> Main
	class places.css {
		<<file>>
		places
		places__list
		places__item
	}
	places.css ..> Main
	places.css ..> Card
	class card.css {
		<<file>>
		card
		card__description
		card__image
		card__like-button
		card__like-button_is-active
		card__delete-button
		card__delete-button_hidden
		card__delete-button_visible
		card__title
		card__like-count
	}
	card.css ..> Card
	class popup.css {
		<<file>>
		popup
		popup__content
		popup__content_content_image
		popup__close
		popup__title
		popup__form
		popup__input
		popup__input_type_error
		popup__button
		popup__button_disabled
		popup__caption
		popup__image
		popup__label
		popup__error
		popup__error_visible
		-popup_type_remove-card
		-popup_type_edit-avatar
		popup__icon
		popup__status-message
	}
	popup.css ..> AddPlacePopup
	popup.css ..> EditAvatarPopup
	popup.css ..> EditProfilePopup
	popup.css ..> ImagePopup
	popup.css ..> InfoTooltip
	popup.css ..> PopupWithForm
	class popup_is-opened.css {
		<<file>>
		popup_is-opened
	}
	popup_is-opened.css ..> ImagePopup
	popup_is-opened.css ..> InfoTooltip
	popup_is-opened.css ..> PopupWithForm
	class auth-form.css {
		<<file>>
		auth-form
		auth-form__title
		auth-form__form
		auth-form__input
		auth-form__textfield
		auth-form__button
		auth-form__text
		auth-form__link
	}
	auth-form.css ..> Login
	auth-form.css ..> Register
```

### Выбор метода интеграции микрофронтендов

Исходя из поставленной цели разделения приложения — повышение организационной гибкости и обеспечение возможности выпускать релизы отдельных бизнес-функций независимо друг от друга, для интеграции микрофронтендов подходит `run time` метод.

Метод `run time` интеграции позволит:
- Развёртывать модули независимо
- Динамически обновлять отдельные модули

### Выбор метода композиции микрофронтендов

В качестве метода композиции микрофронтендов будет использован метод клиентской композиции. Этот подход позволяет создавать богатый интерактивный пользовательский опыт, который необходим для приложения Mesto.

### Выбор инструмента для создания микрофронтендов

В качестве инструмента для создания микрофронтендов будет использован Webpack Module Federation. Данное решение позволит достигнуть поставленной цели, а также избежать дублирования зависимостей.

### Определение границ микрофронтендов

На основании результатов анализа проекта предлагается разделить приложение на три микрофронтенда, используя вертикальную нарезку в качестве стратегии проектирования. 

Задачу интеграции микрофронтендов будет решать приложение `host`, расположенное в каталоге `frontend/microfrontend` наряду с микрофронтендами.

#### `auth` — регистрация и аутентификация пользователей

Задача регистрации и аутентификации в исходном приложении решается следующими компонентами и сервисами:

- Компоненты
	- `Login` — форма входа
	- `Register` — форма регистрации
	- `InfoTooltip` — информационный диалог для вывода результата операции
- Сервисы
	- `auth` — методы для обращения к `API` бекэнда в части регистрации и аутентификации:
		- `register`
		- `login`
		- `checkToken`

Для переноса компонентов в микрофронтенд потребуется разорвать существующие статические связи, а также решить задачу обмена информацией о статусе аутентификации между основным приложением `host` и компонентом `Login`. Для этого указанный компонент будет публиковать события:

- `on-login-success` — аутентификация выполнена успешно.
- `on-token-valid` — проверка токена успешно завершена. Токен валиден.
- `on-token-invalid` — проверка токена завершена не успешно.

И слушать событие `token-check-required` — требуется проверка токена.

#### `profile` — взаимодействие с профилем текущего пользователя

Для взаимодействия с профилем текущего пользователя в исходном приложении разработаны следующие компоненты и сервисы:

- Компоненты
	- `Main` — содержит секцию для вывода элементов управления профилем текущего пользователя и секцию для взаимодействия с карточками мест. Потребуется выделить из компонента новый компонент `Profile` и переместить его в микрофронтенд `profile`.
	- `EditAvatarPopup` — диалог для изменения аватара в профиле пользователя.
	- `EditProfilePopup` — диалог для редактирования профиля пользователя.
	- `PopupWithForm` —  базовый диалог необходимый для компонентов `EditAvatarPopup` и `EditProfilePopup`.
- Сервисы
	- `api` — содержит методы для обращения к `API` бекэнда в части профиля пользователя и карточек мест. При переносе сервиса в микрофронтенд требуется оставить только методы относящиеся к профилю пользователя:
		- `getUserInfo` — получить информацию о профиле пользователя.
		- `setUserInfo` — изменить информацию о профиле пользователя.
		- `setUserAvatar` — изменить аватар пользователя.

#### `place` — взаимодействие с каталогом мест

Для взаимодействия с каталогом мест в исходном приложении разработаны следующие компоненты и сервисы:

- Компоненты
	- `Main` — содержит секцию для вывода элементов управления профилем текущего пользователя и секцию для взаимодействия с карточками мест. Потребуется выделить из компонента новый компонент `Places` и переместить его в микрофронтенд `place`.
	- `Card` — карточка места.
	- `AddPlacePopup` — диалог для добавления нового места.
	- `ImagePopup` — диалог для просмотра изображения места.
	- `PopupWithForm` —  базовый диалог необходимый для компонента `AddPlacePopup`
- Сервисы
	- `api` — содержит методы для обращения к `API` бекэнда в части профиля пользователя и карточек мест. При переносе сервиса в микрофронтенд требуется оставить только методы относящиеся к карточкам мест:
		- `getCardList` — получить коллекцию карточек.
		- `addCard` — добавить новую карточку.
		- `removeCard` — удалить карточку
		- `changeLikeCardStatus` — изменить лайк для карточки места.

## Задача 2

В этом задании вам нужно декомпозировать веб-приложения на Django на микросервисы. Кодить не придётся: в этот раз вы будете работать в онлайн-редакторе draw.io.

> [!NOTE] Важно!
> Решение задачи расположено на странице `Task2` в файле [arch_template_task2.drawio](arch_template_task2.drawio).

Монолитное приложение предлагается декомпозировать на следующие микросервисы.

- BFF для участников электронной площадки (клиентов)
- BFF для администратора электронной площадки
- Сервис технической поддержки
- Сервис аутентификации и авторизации пользователей
- Сервис профилей пользователей
- Сервис каталога товаров и услуг
- Сервис проведения аукционов
- Сервис апелляции
- Сервис заказов
- Сервис платежей
- Сервис отчетов

Взаимодействия между микросервисами пронумерованы и представлены стрелками на диаграмме.

1. Аутентификация и авторизация пользователей (участников площадки, администраторов и специалистов поддержки). Без прохождения аутентификации пользователь имеет возможность подать заявку на регистрацию. Остальные функции доступны только для аутентифицированных пользователей.
2. Заявка на регистрацию — пользователь отправляет заявку на регистрацию на электронной площадке.
3. Валидация заявки на регистрацию — администратор валидирует заявку.
4. Создание пользователя — после валидации запускается процесс создания пользователя.
5. Взаимодействие с каталогом — пользователь имеет возможность взаимодействовать с каталогом товаров и услуг. Искать товары и услуги, добавлять новые в профиль, а так же удалять ранее добавленные.
6. Взаимодействие с аукционом — пользователь имеет возможность создавать аукционы, а так же принимать участие в аукционах других пользователей, делая ставки.
7. Редактирование аукциона — администратор имеет возможность вносить изменения в созданные пользователями аукционы.
8. Апелляция — пользователь при несогласии с результатами аукциона имеет возможность подать заявку на апелляцию.
9. Рассмотрение апелляции
	a.Валидация заявки на апелляцию — администратор валидирует заявку.
	b.Изменение статуса аукциона — по итогу апелляции статус аукциона может быть изменен.
10. Данные по аукционам — информация об аукционах публикуется посредством брокера сообщений и накапливается в специализированном хранилище для последующего использования при генерации отчетов.
11. Взаимодействие с заказами — пользователь выигравший аукцион обязан оформить заказ на предмет аукциона (товар, услуга) по итоговой стоимости.
12. Данные по заказам — информация о заказах публикуется посредством брокера сообщений и накапливается в специализированном хранилище для последующего использования при генерации отчетов.
13. Взаимодействие с платежами — пользователь оплачивает заказ.
14. Инициировать платёж — торговая площадка инициирует платёж, отправив необходимые данные (ID пользователя, ID заказа, сумма заказа) в платёжный сервис.
15. Предоставить статус платежа — платёжный сервис принял запрос на проведение оплаты, подтвердил возможность проведения платежа со счёта клиента, назначил идентификатор для этой транзакции и установил статус.
16. Подтверждение платежа — торговая площадка уведомляет платёжный сервис о подтверждении операции, отправляя ID транзакции.
17. Запросить статус платежа — торговая площадка отправляет запрос в платёжный сервис для получения текущего статуса обработки транзакции по ID.
18. Подтверждение отмены платежа (альтернативный сценарий) — платёжный сервис уведомляет систему об успешной отмене платежа, предоставляя статус отменённой транзакции.
19. Формирование отчета — администратор имеет возможность сформировать отчет.

![Решение](arch_template_task2-Task2.drawio.svg)
