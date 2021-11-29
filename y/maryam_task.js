
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTux8kStcOHDEmLKB_fbqGbxNE2lLKHL4",
    authDomain: "paw-lender.firebaseapp.com",
    databaseURL: "https://paw-lender-default-rtdb.firebaseio.com",
    projectId: "paw-lender",
    storageBucket: "paw-lender.appspot.com",
    messagingSenderId: "156009579264",
    appId: "1:156009579264:web:e9123a4fd752386f0669e5",
    measurementId: "G-ZSRT2Q966P"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const db = firebase.firestore();


const tasklist = document.querySelector('#task-list');
const form = document.querySelector('#add-task-form');

// Create element and render cafe
function renderTasklist(doc){
    let li = document.createElement('li');
    let task = document.createElement('span');
    let description = document.createElement('span');
    let category = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id)
    task.textContent = doc.data().task;
    description.textContent = doc.data().description;
    category.textContent = doc.data().category;
    cross.textContent = 'x';

    li.appendChild(task);
    li.appendChild(description);
    li.appendChild(category);
    li.appendChild(cross);

    tasklist.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id= e.target.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    })
}


// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('tasks').add({
        task: form.task.value,
        description: form.description.value,
        category: form.category.value
    });
form.task.value = '';
form.description.value ='';
form.category.value ='';
})

// realtime listener
db.collection('tasks').orderBy('category').onSnapshot(snapshot => { // changed task to category
    let changes = snapshot.docChanges();
    // console.log(changes);
    changes.forEach(change => {
    //console.log(change.doc.data())
        if(change.type == 'added'){
            renderTasklist(change.doc);
        }
        else if(change.type == 'removed'){
            let li = tasklist.querySelector('[data-id=' + change.doc.id +']');
            tasklist.removeChild(li);
        }
    })
}) 