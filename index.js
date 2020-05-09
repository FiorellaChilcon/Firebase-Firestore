//learning-c1281
// async return promise 
// snapshot =  respresntaion of the different data inside
const cafelist = document.querySelector('#cafe-list');
const addCafeForm = document.getElementById('add-cafe-form');
const renderCafe = (doc) => {
    const deleteButton = document.createElement('button')
    const li = document.createElement('li');
    const name = document.createElement('span');
    const city = document.createElement('span');
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    deleteButton.textContent = 'x';
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(deleteButton);
    cafelist.appendChild(li);
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
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
db.collection('cafes').orderBy('city').onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        if (change.type = 'added') {
            renderCafe(change.doc);
        } else if (change.type = 'removed') {
            let li = document.querySelector(`data-id=${change.doc.id}`);
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
    });
    addCafeForm.reset();
});