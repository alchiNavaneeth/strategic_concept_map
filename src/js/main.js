// await fetch('./data/data.json')
//     .then(response => response.json())
//     .then(data => {
//         // Do something with the data here 
//         const titles = document.querySelectorAll(".map .titles");
//         const header = document.querySelector(".card-head-content");
//         const headerTitle = document.querySelector(".card-head-content h4");
//         const headerSpan = document.querySelector(".card-head-content span");
//         const bodyTitle = document.querySelector(".card-body-content h4");
//         const bodyContent = document.querySelector(".card-body-content p");

//         // console.log(data)
//         titles.forEach(title => {
//             title.addEventListener('click', e => {
//                 e.preventDefault();
//                 // console.log(data[title.innerText]["card-header"]["img"]);
//                 // header.style.backgroundImage = "url(" + data[title.innerText]["img"] + ")";
//                 // headerTitle.innerText = data[title.innerText]["card-header"]["title"];
//                 // headerSpan.innerText = data[title.innerText]["card-header"]["span"];
//             })
//         })

//     })
//     .catch(error => console.log(error))
