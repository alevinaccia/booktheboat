let isIOS;

if (navigator.userAgent.indexOf("like Mac") != -1) {
    isIOS = true;
} else {
    isIOS = false;
}

const form = document.querySelector('#bookForm');
const table = document.querySelector('#table');
let currentDate = new Date();
currentDate.setMinutes(0, 0);

const header = document.createElement('tr');

const th1 = document.createElement('th');
th1.innerText = 'Day';
const th2 = document.createElement('th');
th2.innerText = 'Time';
const th3 = document.createElement('th');
th3.innerText = 'Booked by';
header.appendChild(th1);
header.appendChild(th2);
header.appendChild(th3);

form.startTime.addEventListener('change', () => {
    form.endTime.setAttribute('value', validFormat(form.startTime.value, 1));
    form.endTime.setAttribute('min', validFormat(form.startTime.value, 1));
})

this.addEventListener('load', () => {
    form.startTime.setAttribute('value', validFormat(currentDate.toISOString(), 0))
    form.endTime.setAttribute('value', validFormat(currentDate.toISOString(), 1));
    form.endTime.setAttribute('min', validFormat(currentDate.toISOString(), 1));
    fetch('http://192.168.1.88:1333/', {
        method: 'GET',
    }).then(response => response.json())
        .then(data => generateList(data));
})

form.addEventListener('submit', () => {
    event.preventDefault();
    let headers = new Headers();

    headers.append('startTime', form.startTime.value);
    headers.append('endTime', form.endTime.value);

    fetch('http://192.168.1.88:1333/', {
        method: 'POST',
        headers: headers
    }).then(res => res.json())
        .then(data => {
            if (data.message != "I'm sorry, the boat at that time is already booked") {
                generateList(data)
            } else {
                console.log(data);
            }
        })
})

const deleteReservation = (id) => {
    fetch('http://192.168.1.88:1333/', {
        method: 'DELETE',
        headers: {
            id: id
        }
    }).then(response => response.json())
        .then(data => {
            console.log(data)
            generateList(data)
        });
}

const generateList = list => {
    const arr = Object.values(list);

    arr.sort((a,b) => {
        return new Date(b.startTime) - new Date(a.startTime)
    })

    table.innerHTML = '';

    table.appendChild(header);

    for (let i = 0; i < arr.length; i++) {
        let startData;
        let endData;

        if (isIOS) {
            startData = convertToIOS(new Date(arr[i].startTime));
            endData = convertToIOS(new Date(arr[i].endTime));
        } else {
            startData = new Date(arr[i].startTime);
            endData = new Date(arr[i].endTime);
        }

        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.innerText = startData.toDateString();
        let td2 = document.createElement('td');
        td2.innerText = `${startData.getHours()}:00 - ${endData.getHours()}:00`;
        let td3 = document.createElement('td');
        td3.innerText = 'test';
        let td4 = document.createElement('td');
        btn = document.createElement('button');
        btn.innerText = 'Delete';
        btn.setAttribute('onclick', `deleteReservation('${arr[i]._id}')`);
        td4.appendChild(btn);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
}

const validFormat = (string, hoursOffset) => {
    let date = new Date(string);
    date.setHours(date.getHours() + 2 + hoursOffset);
    let validString = date.toISOString().substring(0, date.toISOString().length - 5);
    return validString
}

const convertToIOS = (date) => {
    date.setHours(date.getHours() - 2);
    return date
}