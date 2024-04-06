function addProjectToFirestore1(newProject) {
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
        console.error("Error adding Project: ", error);
    });
}