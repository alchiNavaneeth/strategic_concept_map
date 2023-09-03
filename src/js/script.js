// Select Svg with d3
// const container = d3.select("#circle-container");
// const containerWidth = container.node().getBoundingClientRect().width;
// const containerHeight = 600;


// const svg = container.append("svg")
//   .attr("width", "100%")
//   .attr("height", "100%")
//   .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

const svg = d3.select("#circle-container");
const curve = d3.line().curve(d3.curveNatural); // Curve declaration for threads with d3


// Loading Animation
const animationContainer = document.querySelector(".animation-container");
const handleLoadingAnimation = (animationContainer) => {
  animationContainer.classList.toggle("hidden");
  setTimeout(() => animationContainer.classList.toggle("hidden"), 2000);
}


// Variables declaration
let categories_length;            // Total Categories list
let sub_categories_length;        // Total Sub Categories list
let categories = [];              // Categories list
let sub_categories = [];          // Sub Categories list
let fill_image;                   // Center Image
let jsonData;                     // JSON Data
let category_points = [];         // Small inner circle points list for future use
let sub_category_points = [];     // Small outer circle points list for future use

// Center of the circles
let centerX = 450;                // Inner circle center points
let centerY = 300;
let perX = "50%";
let perY = "50%";
// let centerX = containerWidth / 2;                // Inner circle center points
// let centerY = containerHeight / 2;

// Radii for the circles
let firstRadius = 70;
let secondRadius = firstRadius + 20;
let secondTextRadius = firstRadius + 60;
let thirdRadius = secondRadius + 130;
let thirdTextRadius = secondRadius + 170;

// Stroke color and width for the second and third circles
const mainCircleStroke = "rgba(0, 0, 0, .3)";
const smallCircleStroke = "rgba(0, 0, 0, .6)";
const strokeWidth = 2;

// Text Colors and background
const textColor = "rgba(0, 0, 0)";
const backgroundColor = "#f2f2f2";

const navBtn = document.querySelector(".nav-btn");
const dropDown = document.querySelector(".drop-down");
const ulList = document.querySelector(".history-list");
const card_image = document.querySelector(".card-head-content");
const card_title = document.querySelector(".card-body-content h4");
const card_content = document.querySelector(".card-body-content p");
const readBtn = document.querySelector(".read-more");

let holderNode;
let threadsNode;
let imageNode;
let contentNode;
let rotateAngle;
let chosenTopic = "Zone of Pulp";
let chosenTopicList = [];
let fullText, textArr, limitedText;

// .....
// Media Query for Variying the inner circle center
// .....
const mediaQuery = [
  window.matchMedia('(max-width: 1300px)'),
  window.matchMedia('(max-width: 1100px)'),
  window.matchMedia('(max-width: 950px)'),
  window.matchMedia('(max-width: 800px)'),
];
const handleMediaQuery = (mediaQuery) => {

  if (mediaQuery[0].matches) {
    centerX = 340;
  }

  if (mediaQuery[1].matches) {
    centerX = 480;
  }

  if (mediaQuery[2].matches) {
    centerX = 420;
  }

  if (mediaQuery[3].matches) {
    centerX = 370;
  }
}

handleMediaQuery(mediaQuery);
// window.onresize = () => {
//   handleMediaQuery(mediaQuery);
// }



// ........
// Algorithm Initiation
// ........

// .....
// Inserting g container elements that holds the various map parts
// .....

const handleInitialization = (topic) => {

  // Top g element --- g will be mentioned as node
  svg.append("g").attr("class", "strategic-map-node top-g-node")

  // The circle node which holds the several small circles
  d3.select(".top-g-node").append("g").attr("class", "holder-circle-node");

  // The node which contains the connectors (threads)
  d3.select(".top-g-node").append("g").attr("class", "threads-node");

  // The node which contains the center image and its text
  d3.select(".top-g-node").append("g").attr("class", "image-node");

  // The node which contains the small circles and it's respective contents (text)
  d3.select(".top-g-node").append("g").attr("class", "content-node");


  // Declaring the g nodes
  holderNode = d3.select(".holder-circle-node");
  threadsNode = d3.select(".threads-node");
  imageNode = d3.select(".image-node");
  contentNode = d3.select(".content-node");


  // .....
  // Append the first circle filled with image
  // .....
  imageNode.append("circle")
    .attr("id", "circle")
    .attr("class", "main-circle")
    .attr("cx", centerX)          // center x-coordinate
    .attr("cy", centerY)          // center y-coordinate
    .attr("r", firstRadius);   // first circle radius

  imageNode.append("foreignObject")
    .attr("class", "image-fo")
    .attr("x", centerX - 70)
    .attr("y", centerY - 70)
    .attr("width", "140")
    .attr("height", "140");


  // Inserting div for the center image text foreignObject element 
  document.querySelector(".image-fo").innerHTML = `<div class="image-div"></div>`;
  document.querySelector(".image-div").innerHTML = `<div class="image-content-layer"></div>`;

  // style for the center div
  document.querySelector(".image-div").style.cssText = `
    height: 100%;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  `;

  document.querySelector(".image-content-layer").style.cssText = `
    width: 100%;
    height: 100%;
    padding: .5rem;
    color: white;
    font-size: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
  `;


  // .....
  // Appending inner and outer g for the circles
  // .....
  holderNode.append("g")
    .attr("class", "inner-holder");

  holderNode.append("g")
    .attr("class", "outer-holder");

  // Append the second circle as a stroke line
  d3.select(".inner-holder").append("circle")
    .attr("cx", centerX)          // center x-coordinate
    .attr("cy", centerY)          // center y-coordinate
    .attr("r", secondRadius)      // second circle radius
    .attr("fill", "none")         // no fill
    .attr("stroke", mainCircleStroke)  // stroke color
    .attr("stroke-width", strokeWidth); // stroke width

  // Append the third circle as a stroke line
  d3.select(".outer-holder").append("circle")
    .attr("cx", centerX)          // center x-coordinate
    .attr("cy", centerY)          // center y-coordinate
    .attr("r", thirdRadius)       // third circle radius
    .attr("fill", "none")         // no fill
    .attr("stroke", mainCircleStroke)  // stroke color
    .attr("stroke-width", strokeWidth);

  handleDataFetch(topic);
}

// .....
// Fetching data from JSON function
// .....
const handleDataFetch = async (topic) => {
  await fetch("./data/data.json")
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      categories_length = data[topic].categories_list.length;
      sub_categories_length = data[topic].sub_categories_list.length;
      categories = data[topic].categories_list;
      sub_categories = data[topic].sub_categories_list;
      fill_image = data[topic].img;
    });

  handleCircles(topic);
}


// .....
// Appending Circles based on the data
const handleCircles = (topic) => {
  // .....
  // Append 6 stroked circles along the circumference of the second (inner) circle
  // .....
  for (let i = 0; i < categories_length; i++) {
    // const angle = (i / categories_length) * Math.PI * 2;
    const angle = ((i / categories_length) * 360 - 45) * (Math.PI / 180);
    const x = centerX + secondRadius * Math.cos(angle);
    const y = centerY + secondRadius * Math.sin(angle);

    const textX = centerX + secondTextRadius * Math.cos(angle);
    const textY = centerY + secondTextRadius * Math.sin(angle);

    category_points[i] = [x, y];

    // Appending a g node for circle and text combination  
    contentNode.append("g")
      .attr("class", "node node-" + (i + 1));
    // .attr("transform", "rotate(" + rotateAngle + ")");

    // Appending two g's inside the g node for circle and text
    d3.select(".node-" + (i + 1))
      .append("g")
      .attr("class", "bounce b-" + (i + 1));

    d3.select(".node-" + (i + 1))
      .append("g")
      .attr("class", "text-container tc-" + (i + 1));

    // Appending Circles
    d3.select(".b-" + (i + 1)).append("circle")
      .attr("class", "c-circle sc")   // c-circle stands for category-circle which represents the categories of the topic && sc for common class name
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", "14px")                  // radius of the stroked circles
      .attr("fill", backgroundColor)
      .attr("stroke", smallCircleStroke)
      .attr("stroke-width", strokeWidth);

    if (i >= categories_length / 2) {
      d3.select(".tc-" + (i + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (i + 1))
        .attr("x", textX - 55)
        .attr("y", textY - 10)
        .attr("width", "90")
        .attr("height", "36");

      document.querySelector(".c-fo-" + (i + 1)).innerHTML = `<div class="c-text right-align">Macrophages, Lymphocytes, and Plasma Cells</div>`;
    }

    else {
      d3.select(".tc-" + (i + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (i + 1))
        .attr("x", textX - 15)
        .attr("y", textY - 10)
        // .attr("x", textX)
        // .attr("y", textY)
        .attr("width", "90")
        .attr("height", "36");

      document.querySelector(".c-fo-" + (i + 1)).innerHTML = `<div class="c-text"></div>`;
    }
  }

  document.querySelectorAll(".c-text").forEach(div => {
    div.style.cssText = `
      font-size: 12px;
      color: ${textColor};
      font-weight: 600;
      cursor: pointer;
    `
  })


  // .....
  // Append 6 stroked circles along the circumference of the second circle
  // .....
  let n = categories_length;

  for (let i = 0; i < sub_categories_length; i++) {
    // const angle = (i / sub_categories_length) * Math.PI * 2;
    const angle = ((i / sub_categories_length) * 360 - 70) * (Math.PI / 180);
    const x = centerX + thirdRadius * Math.cos(angle);
    const y = centerY + thirdRadius * Math.sin(angle);
    sub_category_points[i] = [x, y]


    const textX = centerX + thirdTextRadius * Math.cos(angle);
    const textY = centerY + thirdTextRadius * Math.sin(angle);


    // Appending a g node for circle and text combination  
    contentNode.append("g")
      .attr("class", "node node-" + (n + 1));

    // Appending two g's inside the g node for circle and text
    d3.select(".node-" + (n + 1))
      .append("g")
      .attr("class", "bounce b-" + (n + 1));

    d3.select(".node-" + (n + 1))
      .append("g")
      .attr("class", "text-container tc-" + (n + 1))

    d3.select(".b-" + (n + 1)).append("circle")
      .attr("class", "sc-circle sc")   // sc-circle stands for sub-category-circle which represents the categories of the topic && sc for common class name
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", "11px")                  // radius of the stroked circles
      .attr("fill", backgroundColor)
      .attr("stroke", smallCircleStroke)
      .attr("stroke-width", strokeWidth);

    if (i >= sub_categories_length / 2) {
      d3.select(".tc-" + (n + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (n + 1))
        .attr("x", textX - 75)
        .attr("y", textY - 5)
        .attr("width", "90")
        .attr("height", "36");

      document.querySelector(".c-fo-" + (n + 1)).innerHTML = `<div class="sc-text right-align"></div>`;
    }

    else {
      d3.select(".tc-" + (n + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (n + 1))
        .attr("x", textX - 15)
        .attr("y", textY - 12)
        .attr("width", "90")
        .attr("height", "36");

      document.querySelector(".c-fo-" + (n + 1)).innerHTML = `<div class="sc-text"></div>`;
    }
    n++;
  }

  // let textAngle = -60;
  document.querySelectorAll(".sc-text").forEach(div => {
    div.style.cssText = `
      font-size: 10px;
      color: ${textColor};
      font-weight: 600;
      cursor: pointer;
    `;
  });

  document.querySelectorAll(".right-align").forEach(div => {
    div.style.cssText += `
      text-align: right;
    `
  });

  handleDataLoading(topic);
}


// .....
// Loading Data based on click
// .....
const handleDataLoading = async (topic) => {

  // Card Image
  card_image.style.backgroundImage = "url(" + fill_image + ")";

  // Center Circle Div
  document.querySelector(".image-div").style.cssText += `
    background-image: url(${fill_image})
  `;
  document.querySelector(".image-content-layer").innerText = topic;

  // Categories Circle Div
  document.querySelectorAll(".c-text").forEach((div, i) => {
    div.innerText = categories[i];
  });

  // Sub Categories Circle Div
  document.querySelectorAll(".sc-text").forEach((div, i) => {
    div.innerText = sub_categories[i];
  });

  handleSelections(topic);
}


// .....
// Calling data handler for first time loading
// .....
const handleSelections = (topic) => {

  let sub_highlight_contents;
  const c_circles_list = document.querySelectorAll(".c-circle");
  const sc_circles_list = document.querySelectorAll(".sc-circle");
  const sc_text_list = document.querySelectorAll(".sc-text");
  const c_text_list = document.querySelectorAll(".c-text");
  const allCirclesList = [c_circles_list, c_text_list, sc_circles_list, sc_text_list];

  // card_image.style.backgroundImage = "url(" + fill_image + ")";

  // .....
  // Threads Integration
  // .....
  for (let i = 0; i < categories_length; i++) {
    let sc_highlight_list = Object.keys(jsonData[topic].categories[c_text_list[i].innerText].sub_categories);

    for (let j = 0; j < sub_categories_length; j++) {
      for (let k = 0; k < sc_highlight_list.length; k++) {
        if (sc_text_list[j].innerText == sc_highlight_list[k]) {
          let point1 = [category_points[i], sub_category_points[j]];
          threadsNode.append('path')
            .attr("class", "thread thread-" + (i + 1))
            .attr("d", curve(point1))
            .attr("stroke", "#0000001F")
            .attr("stroke-width", "1")
            .attr("fill", "none");
        }
      }
    }
  }


  // .....
  // Click handler function for circles and text
  // .....
  const clickHandler = (which, index) => {
    const threadElements = document.querySelectorAll(".thread");
    let specificThreadElements, title, content;
    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight");
      c_text_list[i].classList.remove("highlight");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      threadElements[i].classList.remove("highlight-thread");
      sc_text_list[i].classList.remove("highlight");
      sc_circles_list[i].classList.remove("highlight");
    }

    // For Categories Circles
    if (which == "c") {
      specificThreadElements = document.querySelectorAll(".thread-" + (index + 1));
      title = jsonData[topic].categories[c_text_list[index].innerText].card_content.title;
      content = jsonData[topic].categories[c_text_list[index].innerText].card_content.content;

      c_circles_list[index].classList.add("highlight");
      c_text_list[index].classList.add("highlight");
      card_title.innerText = title;
      card_content.innerText = content;

      sub_highlight_contents = Object.keys(jsonData[topic].categories[c_text_list[index].innerText].sub_categories);

      for (let j = 0; j < sc_text_list.length; j++) {
        for (let k = 0; k < sub_highlight_contents.length; k++) {
          if (sc_text_list[j].innerHTML == sub_highlight_contents[k]) {
            sc_text_list[j].classList.add("highlight");
            sc_circles_list[j].classList.add("highlight");
            specificThreadElements[k].classList.add("highlight-thread");
          }
        }
      }
    }

    // For Sub Categories Circles
    else {
      title = jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.title;
      content = jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.content;

      chosenTopicList.push(chosenTopic);
      chosenTopic = sc_text_list[index].innerText;
      handleLoadingAnimation(animationContainer);
      setTimeout(() => {
        document.querySelector("#circle-container").innerHTML = "";
        handleInitialization(chosenTopic);
        card_title.innerText = title;
        card_content.innerText = content;
        handleReadMore(content)
        handleNavHistory();
      }, 2000);
      // sc_circles_list[index].classList.add("highlight");
      // sc_text_list[index].classList.add("highlight");
    }
  }


  // .....
  // Click listener for all circles and text 
  // .....
  allCirclesList.forEach((item, i) => {
    item.forEach((liItem, index) => {
      liItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (i < 2) {
          clickHandler("c", index);
          setTimeout(handleReadMore(), 2000);
        }
        else {
          clickHandler("sc", index);
          setTimeout(handleReadMore(), 2000);
        }
      })
    })
  });
}

let handleText;
// .....
// Read more funtion for card content
// .....
const handleReadMore = (fullText = card_content.innerText) => {

  textArr = fullText.split(" ");
  limitedText = "";
  card_content.innerText = "";

  for (let i = 0; i < 25; i++) {
    limitedText += " " + textArr[i];
  }

  handleText = (which) => {
    if (which == "limit") {
      readBtn.innerText = "Read More";
      card_content.innerText = limitedText + "...";
    }

    else {
      readBtn.innerText = "Read Less";
      card_content.innerText = fullText;
    }
  }
  handleText("limit");
}


// .....
// Calling the main function - Initialization
// .....
handleInitialization(chosenTopic);
handleReadMore();

readBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (readBtn.innerText == "Read More") {
    handleText("full");
  }
  else {
    handleText("limit");
  }
})

// .....
// Navigation History
// .....

const handleNavHistory = () => {
  ulList.innerHTML = "";

  chosenTopicList.forEach(li => {
    ulList.innerHTML += `<li>${li}</li>`;
  });

  const listItem = document.querySelectorAll(".history-list li");
  listItem.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      // History nav list items click function - For fututre ref
    })
  })
}

navBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dropDown.classList.toggle("drop-show");
  navBtn.classList.toggle("drop-focus");
});



