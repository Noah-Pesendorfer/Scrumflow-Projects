import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, addDoc, deleteDoc, updateDoc, doc, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZJTH0Znyi13etPM6Ag5M-lQ_WeqXOIsU",
    authDomain: "scrumflow-6e479.firebaseapp.com",
    projectId: "scrumflow-6e479",
    storageBucket: "scrumflow-6e479.appspot.com",
    messagingSenderId: "828323679259",
    appId: "1:828323679259:web:6db3cfbf89942cc3d4fcbe",
    measurementId: "G-2427QNHC73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//let currentProject = null;

// Authentifizierungsstatus beibehalten
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in with UID:", user.uid);
      loadProjectsIntoHTML();
    } else {
      console.log("No user is signed in.");
    }
});

function loadProjectsIntoHTML() {
    const user = auth.currentUser;
    if (user) {
        const projectsRef = collection(db, "users", user.uid, "projects");
        getDocs(projectsRef)
            .then(querySnapshot => {
                const projects = [];
                querySnapshot.forEach(doc => {
                    const projectData = doc.data();
                    const project = { id: doc.id, ...projectData };
                    projects.push(project);
                });

                // Container für die Projektliste
                const container = document.getElementById('project-list-container');
                
                // Durch jedes Projekt iterieren und eine Card erstellen
                projects.forEach(async project => {
                    const card = document.createElement('div');
                    card.classList.add('folder');

                    const title = document.createElement('h2');
                    title.classList.add('name');
                    if (project.title.length > 14) {
                        project.title = project.title.substring(0, 12) + '...';
                    }
                    title.textContent = project.title;
                    card.appendChild(title);

                    const options = document.createElement('div');
                    options.classList.add('options');





                    const tasksRef = collection(db, "users", user.uid, "projects", project.id, "tasks");

                    const taskSnapshot = await getCountFromServer(tasksRef);
                    let tasksAmount = taskSnapshot.data().count;

                    const option1 = document.createElement('h5');
                    option1.textContent = 'Tasks: ' + tasksAmount;
                    options.appendChild(option1);

                    const option2 = document.createElement('h5');
                    const endDate = project.endDate.toDate();
                    option2.textContent = endDate.toDateString();
                    options.appendChild(option2);

                    card.appendChild(options);

                    // Weitere Informationen können hier hinzugefügt werden, z.B. Beschreibung, Datum usw.

                    container.appendChild(card);
                });
            })
        .catch(error => {
          console.error("Error loading projects: ", error);
        });
    } else {
      console.log("No user signed in.");
    }
}

// SIDE MENU

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
}

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

const titleEl = document.querySelector('.input-text');
const dateEl = document.querySelector('.input-date');
const category = document.querySelector('.select-category');

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#submitBtn').addEventListener('click', (e) => {
        e.preventDefault();

        console.log("Add-Funktion")
        let projectTitle = titleEl.value;
        let projectDate = new Date(dateEl.value);
        let projectCategory = category.value;

        const newProject = {
            title: projectTitle,
            endDate: projectDate,
            category: projectCategory
        }

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to add events.");
            return;
        }

        const projectsRef = collection(db, "users", user.uid, "projects");
        addDoc(projectsRef, newProject).then(docRef => {
            newProject.id = docRef.id;
            projectsArr.push(newProject);
            showProjects();
            closeIcon.click();
        }).catch(error => {
            console.error("Error adding event: ", error);
        });

        //addProjectToFirestore(newProject);
    });
});

export function addProjectToFirestore(newProject) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add events.");
        return;
    }

    const projectsRef = collection(db, "users", user.uid, "projects");
    addDoc(projectsRef, newProject).then(docRef => {
        newProject.id = docRef.id;
        projectsArr.push(newProject);
        showProjects();
        closeIcon.click();
    }).catch(error => {
        console.error("Error adding event: ", error);
    });
}