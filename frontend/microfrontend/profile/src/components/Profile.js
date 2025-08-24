import React from 'react';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from "../utils/api";

function Profile() {
    const [currentUser, setCurrentUser] = React.useState({});
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    React.useEffect(() => {
        api
          .getUserInfo()
          .then((userData) => {
            setCurrentUser(userData);
          })
          .catch((err) => console.log(err));
      }, []);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
    }

    function handleUpdateUser(userUpdate) {
        api
        .setUserInfo(userUpdate)
        .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
        .setUserAvatar(avatarUpdate)
        .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <section className="profile page__section">
                <div className="profile__image" onClick={handleEditAvatarClick} style={{backgroundImage: `url(${currentUser.avatar})`}}></div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <button className="profile__edit-button" type="button" onClick={handleEditProfileClick}></button>
                    <p className="profile__description">{currentUser.about}</p>
                </div>
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onUpdateUser={handleUpdateUser}
                    onClose={closeAllPopups}
                    />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onUpdateAvatar={handleUpdateAvatar}
                    onClose={closeAllPopups}
                    />
            </section>
        </CurrentUserContext.Provider>
    );
}

export default Profile;