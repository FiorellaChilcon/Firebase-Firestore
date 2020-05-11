//learning-c1281
// async return promise 
// snapshot =  respresntaion of the different data inside
const cafelist = document.querySelector('#cafe-list');
const addCafeForm = document.getElementById('add-cafe-form');
const renderCafe = (doc) => {
    const deleteButton = document.createElement('i');
    const editButton = document.createElement('i');
    const saveButton = document.createElement('i')
    const li = document.createElement('li');
    const name = document.createElement('span');
    const city = document.createElement('span');
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    deleteButton.className = 'fas fa-trash';
    editButton.className = 'fas fa-edit';
    saveButton.className = 'fas fa-save';
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    cafelist.appendChild(li);
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
    editButton.addEventListener('click', () => {
        city.contentEditable = 'true';
         city.focus();
         li.appendChild(saveButton);
    });
    saveButton.addEventListener('click', (e) => {
        city.contentEditable = 'false';
        const id = e.target.parentElement.getAttribute('data-id');
        li.removeChild(saveButton);
        db.collection('cafes').doc(id).update({
            city: city.textContent
        })
    });
}
// ______________making queries______________
//  where('city', '==', 'San Isidro')
//  where('city', '>', 'n') filtra los nombres que enpienzen por letras mayores que 'n', e.g a,b,c,d...m
// ______________ordering data (A-Z)______________
//  orderBy('name')
// when mixing both, console will show an err, just click the link and create the indexes
//  where('city', '==', 'San Isidro').orderBy('name')
// db.collection('cafes').where('city', '==', 'San Isidro').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         renderCafe(doc);
//     });
// });
// ______________real time data listener______________
//  for that we need to hear the changes automatically from firebase
// onSnapshot is to hear when there's a change on the database
db.collection('cafes').orderBy('name').onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = document.querySelector(`[data-id=${change.doc.id}]`);
            cafelist.removeChild(li);
        }
    });
});
// ______________getting data______________
// db.collection('cafes').get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         renderCafe(doc);
//     });
// });
//______________saving data______________
addCafeForm.addEventListener('submit', (e) => {
    // prevent the page to reload
    e.preventDefault();
    db.collection('cafes').add({
        name: addCafeForm.name.value,
        city: addCafeForm.city.value,
        // timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    addCafeForm.reset();
});