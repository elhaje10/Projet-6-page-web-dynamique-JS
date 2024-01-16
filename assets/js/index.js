//#region - /* ===== VÉRIFICATION DE FETCH ===== */
if (!window.fetch) {
    alert("Your browser does not support fetch API");
}
//#endregion

//#region - /*===== VARIABLES =====*/
    /* Élément du DOM pour la galerie et les boutons de catégories */
    const gallery = document.querySelector(".gallery");
    const filters = document.querySelector(".container-filtres");

    /* Si l'utilisateur est connecter, getItem récupérer la valeur de window.sessionStorage */
    const loged = window.sessionStorage.getItem("loged");

    /* Élément du DOM pour le mode admin */
    const admin = document.querySelector("header nav .admin");
    const logout = document.querySelector("header nav .logout");
    
    /* Élément du DOM pour la navbar en mode admin */
    const portfolio = document.querySelector("#portfolio");
    const portfolioTitle = document.querySelector("#portfolio h2");
    const adminTitle = " Mode édition";
    const LogoAdminMod = `<i class="fa-regular fa-pen-to-square"></i>`;
    const adminLog = `<div class="admin-mod"><p>${LogoAdminMod}${adminTitle}</p></div>`;
    const divEdit = document.createElement("div");
    const spanEdit = document.createElement("span");
    const adminConexionDown = `${LogoAdminMod}  ${adminTitle} `;

//#endregion

//#region - /*===== WORKS (afficher des œuvres) =====*/
    /* Fonction asynchrone qui effectue une requête HTTP pour récupérer des données depuis l'API */
    async function getWorks() {
        try {
            /* Effectue une requête HTTP à l'URL spécifiée */
            const response = await fetch("http://localhost:5678/api/works");

            /* Vérifie si la réponse HTTP indique une réussite */
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des œuvres depuis la connexion vers API.');
            }

            /* Si la réponse est OK, passe la réponse en tant que JSON et la retourne */
            return await response.json();
        } catch (error) {

            /*  En cas d'erreur, affiche l'erreur dans la console */
            console.error(error.message);
            /* Retourne un tableau vide pour indiquer qu'aucune œuvre n'a été récupérée */
            return [];
        }
    }
    /* Appel de la fonction pour récupérer les données depuis l'API */
    getWorks();

    /* Fonction asynchrone permettant l'afficher les œuvres */
    async function displayWorks() {
        /* Récupération des œuvres depuis l'API de manière asynchrone */
        const works = await getWorks();

        /* Vidage de la galerie d'images */
        gallery.innerHTML = "";

        /* Pour chaque œuvre dans le tableau, appelle la fonction createWorks avec l'œuvre (work) comme argument */
        works.forEach((work) => {
            createWorks(work);
        });
    }
    /* Appel de la fonction pour afficher les œuvres */
    displayWorks();

    /* Fonction permettant de créer des éléments DOM associés à une œuvre */
    function createWorks(work) {
        /* Crée un élément <figure> pour chaque œuvre */
        const figure = document.createElement("figure");

        /* Crée un élément <img> pour afficher l'image de l'œuvre */
        const img = document.createElement("img");

        /* Crée un élément <figcaption> pour afficher le titre de l'œuvre */
        const figcaption = document.createElement("figcaption");

        /* Définit l'attribut src de l'élément img avec l'URL de l'image de l'œuvre */
        img.src = work.imageUrl;

        /* Définit le contenu textuel de l'élément "figcaption" avec le titre de l'œuvre */
        figcaption.textContent = work.title;

        /* Ajoute l'élément img comme enfant de l'élément figure */
        figure.appendChild(img);

        /* Ajoute l'élément figcaption comme enfant de l'élément figure */
        figure.appendChild(figcaption);

        /* Ajoute l'élément figure comme enfant de l'élément avec la classe "gallery" */
        gallery.appendChild(figure);
    }
//#endregion

//#region - /*===== BOUTONS DE CATÉGORIES =====*/
    /* Récupération des catégories du tableau */
    async function getCategories() {
        try {
            /* Effectue une requête HTTP vers l'API pour obtenir les catégories */
            const response = await fetch("http://localhost:5678/api/categories");

            /* Vérifie si la réponse HTTP indique une réussite */
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories depuis la connexion vers API.');
            }

            /* Si la réponse est OK, passe la réponse en tant que JSON et la retourne */
            return await response.json();
        } catch (error) {

            /*  En cas d'erreur, affiche l'erreur dans la console */
            console.error(error.message);

            /* Retourne un tableau vide pour indiquer qu'aucune catégorie n'a été récupérée */
            return [];
        }
    }

    /* Affichage des catégories du tableau */
    async function displayCategoriesButtons() {

        /* Appel la fonction getCategories pour obtenir les catégories depuis l'API */
        const categories = await getCategories();

        /* Pour chaque catégorie obtenue, crée un bouton et l'ajoute à un élément avec la classe "container-filtres" */
        categories.forEach((category) => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.id = category.id;
            filters.appendChild(btn);
        });
    }
    /* Appel la fonction displayCategoriesButtons pour afficher les boutons des catégories dans le DOM */
    displayCategoriesButtons();

    /* Filtrage des boutons de catégories */
    async function filterCategorie() {
        /* Récupération des œuvres de manière asynchrone */
        const images = await getWorks();

        /* Sélection de tous les boutons dans l'élément avec la classe "container-filtres" */
        const buttons = document.querySelectorAll(".container-filtres button");

        /* Ajout d'un écouteur d'événements "click" à chaque bouton */
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                /* Suppression de la classe "active" de tous les boutons */
                buttons.forEach((btn) => {
                    btn.classList.remove("active");
                });

                /* Ajout de la classe "active" uniquement au bouton cliqué */
                button.classList.add("active");

                /* Récupération de l'ID du bouton cliqué */
                const btnId = e.target.id;

                /* Vidage de la galerie d'images */
                gallery.innerHTML = "";

                /* Parcours de toutes les œuvres */
                images.forEach((work) => {
                    /* Si l'ID du bouton correspond à l'ID de la catégorie de l'œuvre
                    ou si l'ID du bouton est "0", afficher l'œuvre dans la galerie */
                    if (btnId == work.categoryId || btnId == "0") {
                        createWorks(work);
                    }
                });
            });
        });
    }
    /* Appel de la fonction pour filtrer les catégories au chargement de la page */
    filterCategorie();
//#endregion

//#region - /*===== MODE ADMIN =====*/
    function authentificationReussie() {
        /* Si l'authentification pour l'utilisateur est réussie avec l'API */
        window.sessionStorage.setItem("loged", true);
        /* Appel la fonction administrateur */
        administrateur();
    }

    function administrateur() {
        if (loged) {
            logout.textContent = "logout";
            document.body.insertAdjacentHTML("afterbegin", adminLog);
            spanEdit.innerHTML = adminConexionDown;
            divEdit.classList.add("div-edit");
            divEdit.appendChild(portfolioTitle);
            divEdit.appendChild(spanEdit);
            portfolio.prepend(divEdit);
            filters.style.display = "none";
        }
    }
    /* Appel de la fonction d'authentification réussie pour déclencher les modifications au DOM */
    authentificationReussie();
//#endregion

//#region - /*===== MODALES =====*/
    /* Élément du DOM pour la modale 1 */
    const containerModals = document.querySelector(".container-modals");
    const closeModals = document.querySelector(".container-modals .fa-xmark");
    const projetModal = document.querySelector(".projet-modal");

    /* Création de la modale 1 pour gérer les projets */
    function modal() {
        if (loged === "true") {
            logout.addEventListener("click", () => {
                /* Déconnexion : Mettez à jour la sessionStorage */
                window.sessionStorage.removeItem("loged");
            });
        }
        /* Au click sur "Mode édition" affichage de la modale pour gérer les projets */
        divEdit.addEventListener("click", () => {
            containerModals.style.display = "flex";
        });
        /* Au click sur "la croix dans la modale" ferme l'affichage pour gérer les projets */
        closeModals.addEventListener("click", () => {
            containerModals.remove();
        });
        /* Permet de fermer la modale sans passer par le croix */
        containerModals.addEventListener("click", (e) => {
            if (e.target.className === "container-modals") {
                containerModals.remove();
            }
        });
        /* Permet de fermer la modale en appuyant sur la touche "Echap" */
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                containerModals.remove();
            }
        });
    }
    modal()

    /* Affichage et gestion de la galerie d'images dans la modale 1 */
    async function displayWorkModal() {
        projetModal.innerHTML = "";
        const imageWork = await getWorks();
        imageWork.forEach(projet => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const span = document.createElement("span");
            const trash = document.createElement("i");
            trash.classList.add("fa-solid", "fa-trash-can");
            trash.id = projet.id;

            /* Ajoute un gestionnaire d'événements au clic sur l'icône de corbeille */
            trash.addEventListener("click", (e) =>  {
                /* Empêche la propagation de l'événement pour éviter d'activer d'autres événements */
                e.stopImmediatePropagation();

                /* Récupèration du token d'authentification depuis la sessionStorage */
                const token = window.sessionStorage.getItem("token");
                /* Envoie une requête DELETE au serveur pour supprimer le projet */
                fetch(`http://localhost:5678/api/works/${projet.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then (res => {
                    console.log(res)
                    figure.remove()
                })
                .catch (error => {
                    console.error(error)
                })
            })
            img.src = projet.imageUrl;
            span.appendChild(trash);
            figure.appendChild(span);
            figure.appendChild(img);
            projetModal.appendChild(figure);
        });
    }
    displayWorkModal();

    /*====================================================*/

    /* Élément du DOM pour la modale 2 */
    const btnAddWorkModal = document.querySelector(".modal-projet button");
    const modalAddWork = document.querySelector(".modal-addworks");
    const modalProjet = document.querySelector(".modal-projet");
    const arrowleft = document.querySelector(".modal-addworks .fa-arrow-left");
    const markAdd = document.querySelector(".modal-addworks .fa-xmark");

    /* Fonction permettant l'affichage de la modale 2 */
    function displayAddWorkModal() {
        /* Au clique du boutton de la modale 1 affiche la modale 2 pour ajouter une image */
        btnAddWorkModal.addEventListener("click", () => {
            modalAddWork.style.display = "flex";
            modalProjet.style.display = "none";
        });
        /* Au clique de la flèche retour à la modale 1 */
        arrowleft.addEventListener("click", () => {
            modalAddWork.style.display = "none";
            modalProjet.style.display = "flex";
        });
        /* Au clique du boutton "Valider" de la modale 2 fermeture de la fenêtre et retour à l'index */
        markAdd.addEventListener("click", () => {
            containerModals.style.display = "none";
            window.location = "index.html";
        });
    }
    displayAddWorkModal();

    /* Élément du DOM pour la modale 2 pour la prévisualisation de l'image uploader */
    const previewImg = document.querySelector(".container-file img");
    const inputFile = document.querySelector(".container-file input");
    const labelFile = document.querySelector(".container-file label");
    const iconFile = document.querySelector(".container-file .fa-image");
    const pFile = document.querySelector(".container-file p");

    /*  Ajoute un gestionnaire d'événements au changement de la sélection de fichier */
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        console.log(file);

        /* Vérifie si un fichier a été sélectionné et s'il s'agit d'une image */
        if (file && file.type.startsWith("image/")) {
            /* Crée un objet FileReader pour lire le contenu du fichier */
            const reader = new FileReader();

            /* Configure une fonction à exécuter une fois le fichier lu avec succès */
            reader.onload = function (e) {
                try {
                    /* Affecte l'URL de l'image au src de l'élément d'aperçu */
                    previewImg.src = e.target.result;

                    /* Affiche l'élément d'aperçu et masque les autres éléments de l'interface */
                    previewImg.style.display = "flex";
                    labelFile.style.display = "none";
                    iconFile.style.display = "none";
                    pFile.style.display = "none";
                } catch (error) {
                    /* Message dans la console informant une erreur de lecture du fichier */
                    console.error("Une erreur est survenue lors de la lecture du fichier :", error);
                }
            };

            /* Commence la lecture du contenu du fichier sous forme d'URL data */
            reader.readAsDataURL(file);
        } else {
            /* Message dans la console informant le cas où le fichier n'est pas une image */
            console.log("Veuillez sélectionner une image valide.");
        }
    });

    /* Ajoute un gestionnaire d'événements au chargement du DOM 
    avec une fonction anonyme exécutée une fois que le document HTML a été complètement chargé */
    document.addEventListener("DOMContentLoaded", function() {
        /* Élément du DOM du formulaire d'uploade pour la modale 2 */
        const form = document.querySelector("form");
        const title = document.querySelector("#title");
        const category = document.querySelector("#category-input");

        /* Ajoute un gestionnaire d'événements pour l'événement de soumission du formulaire */
        form.addEventListener("submit", async (e) => {
            /* Empêche le comportement par défaut du formulaire -rechargement de la page- */
            e.preventDefault();

            /* Crée un objet formData contenant les données du formulaire */
            const formData = {
                title: title.value,
                categoryId: category.value,
                category: {
                    id: category.value,
                    name: category.options[category.selectedIndex].text,
                },
            };

            try {
                /* Envoie une requête POST au serveur avec les données du formulaire */
                const response = await fetch("http://localhost:5678/api/works/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    /* Affiche un message dans la console une fois que l'image est chargée avec succès */
                    console.log("Nouvelle image bien chargée !" + data);
                });

            } catch (error) {
                /* Affiche un message dans la console en cas d'erreur lors de l'envoi de l'image */
                console.log("Une erreur est survenue lors de l'envoi de l'image");
            }
        });
    });

//#endregion