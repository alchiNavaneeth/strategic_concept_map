// Global Declarations
const svg = d3.select("#circle-container");
const svgContainer = document.querySelector('.map');

let containerWidth = svgContainer.clientWidth;
let containerHeight = svgContainer.clientHeight;


// Variables to hold the top g nodes
let holderNode;
let threadsNode;
let imageNode;
let contentNode;

// Variables to hold the data
let categories_length;            // Total Categories list
let sub_categories_length;        // Total Sub Categories list
let categories = [];              // Categories list
let sub_categories;               // Sub Categories list
let fill_image;                   // Center Image
let fill_image_card;              // Card Image
let jsonData;                     // JSON Data
let category_points = [];         // Small inner circle points list for future use
let sub_category_points = [];     // Small outer circle points list for future use

// Radii
let firstRadius = Math.min(containerWidth, containerHeight) / 8;
let secondRadius = Math.min(containerWidth, containerHeight) / 6;
let thirdRadius = Math.min(containerWidth, containerHeight) / 3;


// Variables for HTML element selectors
const animationContainer = document.querySelector(".animation-container");
const navBtn = document.querySelector(".nav-btn");
const dropDown = document.querySelector(".drop-down");
const ulList = document.querySelector(".history-list");
const card_image = document.querySelector(".card-head-content");
const card_title = document.querySelector(".card-body-content h4");
const card_content = document.querySelector(".card-body-content p");
const readBtn = document.querySelector(".read-more");
const popupImage = document.querySelector(".popup-image");
const popupLayer = document.querySelector(".popup-layer");
const hidePanelButton = document.querySelector(".hide-panel");
const hidePanelText = document.querySelector(".hide-panel-text");
const hideIcon = document.querySelector(".hide-icon");
const card = document.querySelector(".card");
const gridContainer = document.querySelector(".grid-container");

let c_circles_list;
let sc_circles_list;
let sc_text_list;
let c_text_list;


let chosenTopic = "Dental Pulp";
let chosenTopicList = [];
let endTopic = "Zones of Pulp";


// ........
// Algorithm Initiation
// ........

// Loading Animation
const handleLoadingAnimation = (animationContainer) => {
  animationContainer.classList.toggle("hidden");
  setTimeout(() => animationContainer.classList.toggle("hidden"), 1000);
}


// .....
// Inserting g node elements that holds the various map parts
// .....
const handleInitialization = (topic) => {

  // Top g element --- g will be mentioned as node
  svg.append("g")
    .attr("class", "top-g-node")
    .attr("transform", `translate(${containerWidth / 2} ${containerHeight / 2})`);

  // The circle node which holds the inner and outer holder circles
  d3.select(".top-g-node").append("g").attr("class", "holder-circle-node");

  // The node which contains the connectors (threads, lines)
  d3.select(".top-g-node").append("g").attr("class", "threads-node");

  // The node which contains the center image and its text
  d3.select(".top-g-node").append("g").attr("class", "image-node");

  // The node which contains the small circles and it's respective contents (text)
  d3.select(".top-g-node").append("g").attr("class", "content-node");


  // Declaring the nodes
  holderNode = d3.select(".holder-circle-node");
  threadsNode = d3.select(".threads-node");
  imageNode = d3.select(".image-node");
  contentNode = d3.select(".content-node");

  // .....
  // Append the first circle filled with image
  // .....
  imageNode.append("circle")
    .attr("class", "main-circle")
    .attr("fill", "none")
    .attr("r", firstRadius);   // first circle radius

  imageNode.append("foreignObject")
    .attr("class", "center-image-fo")
    .attr("width", "140")
    .attr("height", "140")
    .attr("transform", "translate(-70 -70)");


  // Inserting div for the center image text foreignObject element 
  document.querySelector(".center-image-fo").innerHTML = `
  <div class="center-image-div">
    <div class="center-image-matte">
      <p class="center-image-para pointer">Sample Text</p>
    </div>
  </div>`;

  // .....
  // Appending inner and outer g for the circles
  // .....
  holderNode.append("g")
    .attr("class", "inner-holder");

  holderNode.append("g")
    .attr("class", "outer-holder");

  // Append the second circle as a stroke line
  d3.select(".inner-holder").append("circle")
    .attr("class", "stroke-circle inner-circle")
    .attr("r", secondRadius)      // second circle radius

  // Append the third circle as a stroke line
  d3.select(".outer-holder").append("circle")
    .attr("class", "stroke-circle outer-circle")
    .attr("r", thirdRadius)       // third circle radius

  // Call funtion the fetch data 
  handleDataFetch(topic);
}


// .....
// Fetching data from JSON function
// .....
const handleDataFetch = async (topic) => {
  sub_categories = [];
  sub_categories_length = 0;
  await fetch("./src/data/data.json")
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      categories_length = Object.keys(data[topic].categories).length;
      categories = Object.keys(data[topic].categories);

      for (let i = 0; i < categories_length; i++) {
        let l = data[topic].categories[categories[i]].sub_categories.length;
        let s = data[topic].categories[categories[i]].sub_categories;
        sub_categories_length += l;

        for (let j = 0; j < l; j++) {
          sub_categories.push(s[j]);
        }
      }
      // sub_categories = Object.keys(data[topic].sub_categories);
      fill_image = data[topic].img;

      card_title.innerText = data[topic].card_content.title;
      card_content.innerHTML = data[topic].card_content.content;
    });

  // Function call for small circle integration
  handleCircles(topic);
}


// .....
// Appending Circles based on the data
// .....
const handleCircles = (topic) => {
  // .....
  // Append 6 stroked circles along the circumference of the second (inner) circle
  // .....
  for (let i = 0; i < categories_length; i++) {
    const angle = ((i / categories_length) * 360 - 45) * (Math.PI / 180);
    const x = secondRadius * Math.cos(angle);
    const y = secondRadius * Math.sin(angle);
    category_points[i] = [x, y];

    if (i >= categories_length / 2) {
      // Appending a g node for circle and text combination  
      contentNode.append("g")
        .attr("class", "node node-" + (i + 1))
        .attr("transform", `translate(${x} ${y}) rotate(140)`);

      // .....
      // Appending two g's inside the g node for circle and text
      // .....
      // Appending Bounce
      d3.select(".node-" + (i + 1))
        .append("g")
        .attr("class", "bounce b-" + (i + 1));

      // Appending text container
      d3.select(".node-" + (i + 1))
        .append("g")
        .attr("class", "text-container tc-" + (i + 1))
        .attr("transform", "rotate(40)");

      // .....
      // Appending circles and inside text gs
      // .....
      // Appending circle
      d3.select(".b-" + (i + 1)).append("circle")
        .attr("class", "c-circle small-circle pointer")
        .attr("r", "13px");

      // Appending inner text container
      d3.select(".tc-" + (i + 1)).append("g")
        .attr("class", "inner-text-container itc-" + (i + 1))
        .attr("transform", "translate(20)");

      // Appending inner inner text
      d3.select(".itc-" + (i + 1)).append("g")
        .attr("class", "inner-inner-text iit-" + (i + 1))
        .attr("x", "0")
        .attr("y", "-16");

      // Appending foreignObject
      d3.select(".iit-" + (i + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (i + 1))
        .attr("width", "90")
        .attr("height", "20")
        .attr("transform", "translate(45) rotate(180) translate(-45)")
        .attr("x", "0")
        .attr("y", "-16");

      document.querySelector(".c-fo-" + (i + 1)).innerHTML = `<div class="c-text pointer right-align">Sample Content</div>`;
    }

    else {

      // Appending a g node for circle and text combination  
      contentNode.append("g")
        .attr("class", "node node-" + (i + 1))
        .attr("transform", `translate(${x} ${y}) rotate(-64)`);

      // .....
      // Appending two g's inside the g node for circle and text
      // .....
      // Appending Bounce
      d3.select(".node-" + (i + 1))
        .append("g")
        .attr("class", "bounce b-" + (i + 1));

      // Appending text container
      d3.select(".node-" + (i + 1))
        .append("g")
        .attr("class", "text-container tc-" + (i + 1))
        .attr("transform", "rotate(64)");


      // .....
      // Appending circles and inside text gs
      // .....
      // Appending circle
      d3.select(".b-" + (i + 1)).append("circle")
        .attr("class", "c-circle small-circle pointer")       // c-circle stands for category-circle which represents the categories of the topic && sc for common class name
        .attr("r", "13px");

      // Appending inner text container
      d3.select(".tc-" + (i + 1)).append("g")
        .attr("class", "inner-text-container itc-" + (i + 1))
        .attr("transform", "translate(20)");

      // Appending inner inner text
      d3.select(".itc-" + (i + 1)).append("g")
        .attr("class", "inner-inner-text iit-" + (i + 1))
        .attr("x", "0")
        .attr("y", "-16");

      // Appending foreignObject
      d3.select(".iit-" + (i + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (i + 1))
        .attr("width", "90")
        .attr("height", "20")
        .attr("x", "0")
        .attr("y", "-16");

      document.querySelector(".c-fo-" + (i + 1)).innerHTML = `<div class="c-text pointer">Sample Content</div>`;
    }
  }


  // .....
  // Append 6 stroked circles along the circumference of the second circle
  // .....
  let n = categories_length;

  for (let i = 0; i < sub_categories_length; i++) {
    const angle = ((i / sub_categories_length) * 360 - 80) * (Math.PI / 180);
    const x = thirdRadius * Math.cos(angle);
    const y = thirdRadius * Math.sin(angle);
    sub_category_points[i] = [x, y];

    // Calculate the angle in radians
    const angleRadians = Math.atan2(y, x);

    // Convert the angle to degrees
    const angleDegrees = (angleRadians * 180) / Math.PI;


    if (i >= sub_categories_length / 2) {

      // Appending a g node for circle and text combination  
      contentNode.append("g")
        .attr("class", "node node-" + (n + 1))
        .attr("transform", `translate(${x} ${y}) rotate(${angleDegrees})`);

      // .....
      // Appending two g's inside the g node for circle and text
      // .....
      // Appending Bounce
      d3.select(".node-" + (n + 1))
        .append("g")
        .attr("class", "bounce b-" + (n + 1));

      // Appending text container
      d3.select(".node-" + (n + 1))
        .append("g")
        .attr("class", "text-container tc-" + (n + 1));


      // .....
      // Appending circles and inside text gs
      // .....
      // Appending circle
      d3.select(".b-" + (n + 1)).append("circle")
        .attr("class", "sc-circle small-circle pointer")
        .attr("r", "11px");

      // Appending inner text container
      d3.select(".tc-" + (n + 1)).append("g")
        .attr("class", "inner-text-container itc-" + (n + 1))
        .attr("transform", "translate(35)");

      // Appending inner inner text
      d3.select(".itc-" + (n + 1)).append("g")
        .attr("class", "inner-inner-text iit-" + (n + 1))
        .attr("x", "0")
        .attr("y", "-10");

      // Appending foreignObject
      d3.select(".iit-" + (n + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (n + 1))
        .attr("width", "75")
        .attr("height", "20")
        .attr("transform", "translate(30) rotate(180) translate(-30)")
        .attr("x", "0")
        .attr("y", "-10");

      document.querySelector(".c-fo-" + (n + 1)).innerHTML = `<div class="sc-text pointer right-align">Sample Content</div>`;
    }

    else {
      // Appending a g node for circle and text combination  
      contentNode.append("g")
        .attr("class", "node node-" + (n + 1))
        .attr("transform", `translate(${x} ${y}) rotate(${angleDegrees})`);

      // .....
      // Appending two g's inside the g node for circle and text
      // .....
      // Appending Bounce
      d3.select(".node-" + (n + 1))
        .append("g")
        .attr("class", "bounce b-" + (n + 1));

      // Appending text container
      d3.select(".node-" + (n + 1))
        .append("g")
        .attr("class", "text-container tc-" + (n + 1))


      // .....
      // Appending circles and inside text gs
      // .....
      // Appending circle
      d3.select(".b-" + (n + 1)).append("circle")
        .attr("class", "sc-circle small-circle pointer")       // c-circle stands for category-circle which represents the categories of the topic && sc for common class name
        .attr("r", "11px");

      // Appending inner text container
      d3.select(".tc-" + (n + 1)).append("g")
        .attr("class", "inner-text-container itc-" + (n + 1))
        .attr("transform", "translate(20)")
        // .attr("x", "0")
        // .attr("y", "-16");

      // Appending inner inner text
      d3.select(".itc-" + (n + 1)).append("g")
        .attr("class", "inner-inner-text iit-" + (n + 1))
        .attr("x", "0")
        .attr("y", "-10");

      // Appending foreignObject
      d3.select(".iit-" + (n + 1)).append("foreignObject")
        .attr("class", "content-fo c-fo-" + (n + 1))
        .attr("width", "75")
        .attr("height", "20")
        .attr("x", "0")
        .attr("y", "-10");

      document.querySelector(".c-fo-" + (n + 1)).innerHTML = `<div class="sc-text pointer">Sample Content</div>`;
    }
    n++;
  }

  // Function call to load data to respective circles
  handleDataLoading(topic);
}


// .....
// Loading Data based on click
// .....
const handleDataLoading = (topic) => {

  // Card Image
  card_image.style.backgroundImage = "url(" + fill_image + ")";

  // Center Circle Div
  document.querySelector(".center-image-div").style.backgroundImage = "url(" + fill_image + ")";
  popupImage.style.backgroundImage = "url(" + fill_image + ")";

  // Topic
  document.querySelector(".center-image-para").innerText = topic;

  // Categories Circle Div
  document.querySelectorAll(".c-text").forEach((div, i) => {
    div.innerText = categories[i];
  });

  // Sub Categories Circle Div
  document.querySelectorAll(".sc-text").forEach((div, i) => {
    div.innerText = sub_categories[i];
  });


  // .....
  // Onload animation for the map
  // .....
  const handleOnLoadAnimation = () => {
    // Center image
    setTimeout(() => {
      document.querySelector(".center-image-div").classList.add("view");
    }, 100);

    // Categories circle
    setTimeout(() => {
      document.querySelectorAll(".c-circle").forEach(item => {
        item.classList.add("view-circle");
      });
    }, 500);

    // Category text
    setTimeout(() => {
      document.querySelectorAll(".c-text").forEach(item => {
        item.classList.add("view");
      });
    }, 800);

    // Threads
    setTimeout(() => {
      document.querySelectorAll(".thread").forEach(item => {
        item.classList.add("view-thread");
      });
    }, 1000);

    // Sub-category circle
    setTimeout(() => {
      document.querySelectorAll(".sc-circle").forEach(item => {
        item.classList.add("view-circle");
      });
    }, 1200);

    // Sub-category text
    setTimeout(() => {
      document.querySelectorAll(".sc-text").forEach(item => {
        item.classList.add("view");
      });
    }, 1200);
  }

  // On Load animation function call 
  handleOnLoadAnimation();

  // Handle click for small circles
  handleSelections(topic);
}


// .....
// Calling data handler for first time loading
// .....
const handleSelections = (topic) => {

  let sub_highlight_contents;
  c_circles_list = document.querySelectorAll(".c-circle");
  sc_circles_list = document.querySelectorAll(".sc-circle");
  sc_text_list = document.querySelectorAll(".sc-text");
  c_text_list = document.querySelectorAll(".c-text");
  const allCirclesList = [c_circles_list, c_text_list, sc_circles_list, sc_text_list];


  // .....
  // Threads Integration
  // .....
  for (let i = 0; i < categories_length; i++) {
    let sc_highlight_list = jsonData[topic].categories[c_text_list[i].innerText].sub_categories;

    for (let j = 0; j < sub_categories_length; j++) {
      for (let k = 0; k < sc_highlight_list.length; k++) {
        if (sc_text_list[j].innerText == sc_highlight_list[k]) {
          let curveData = [{ x: category_points[i][0], y: category_points[i][1] }, { x: sub_category_points[j][0], y: sub_category_points[j][1] }];
          let diagonal = d3.svg.diagonal()
            .source(function (d) { return { x: d[0].y, y: d[0].x }; })
            .target(function (d) { return { x: d[1].y, y: d[1].x }; })
            .projection(function (d) { return [d.y, d.x]; });

          threadsNode.append('g')
            .attr("class", "g-thread")
            .datum(curveData)
            .append('path')
            .attr("class", "thread thread-" + (i + 1))
            .attr('d', diagonal)
            .attr("stroke", "#0000001F")
            .attr("stroke-width", "1")
            .attr("fill", "none");
        }
      }
    }
  }


  // .....
  // Center div click event
  // .....
  document.querySelector(".center-image-para").addEventListener("click", (e) => {
    e.preventDefault();
    card_image.style.backgroundImage = "url(" + fill_image + ")";
    document.querySelector(".center-image-div").style.backgroundImage = "url(" + fill_image + ")";
    card_title.innerText = jsonData[topic].card_content.title;
    card_content.innerHTML = jsonData[topic].card_content.content;

    const threadElements = document.querySelectorAll(".thread");

    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight-circle");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      threadElements[i].classList.remove("highlight-thread");
      sc_circles_list[i].classList.remove("highlight-circle");
    }
  });


  // .....
  // Click handler function for circles and text
  // .....
  const clickHandler = (which, index) => {
    const threadElements = document.querySelectorAll(".thread");
    let specificThreadElements, title, content;
    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight-circle");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      threadElements[i].classList.remove("highlight-thread");
      sc_circles_list[i].classList.remove("highlight-circle");
    }

    // For Categories Circles
    if (which == "c") {
      specificThreadElements = document.querySelectorAll(".thread-" + (index + 1));
      title = jsonData[topic].categories[c_text_list[index].innerText].card_content.title;
      content = jsonData[topic].categories[c_text_list[index].innerText].card_content.content;
      // highlight Circles
      c_circles_list[index].classList.add("highlight-circle");

      // Change Card Content
      card_title.innerText = title;
      card_content.innerHTML = content;

      // read more button -- reverse property
      readBtn.innerText = "Read More";
      card_content.classList.remove("expanded-content");

      // Center and card image change
      document.querySelector(".center-image-div").style.backgroundImage = "url(" + jsonData[topic].categories[c_text_list[index].innerText].card_content.img + ")";
      card_image.style.backgroundImage = "url(" + jsonData[topic].categories[c_text_list[index].innerText].card_content.img + ")";
      popupImage.style.backgroundImage = "url(" + jsonData[topic].categories[c_text_list[index].innerText].card_content.img + ")";

      sub_highlight_contents = jsonData[topic].categories[c_text_list[index].innerText].sub_categories;

      for (let j = 0; j < sc_text_list.length; j++) {
        for (let k = 0; k < sub_highlight_contents.length; k++) {
          if (sc_text_list[j].innerHTML == sub_highlight_contents[k]) {
            sc_circles_list[j].classList.add("highlight-circle");
            specificThreadElements[k].classList.add("highlight-thread");
          }
        }
      }
    }

    // For Sub Categories Circles
    else {

      if (chosenTopic === endTopic) {
        sc_circles_list[index].classList.add("highlight-circle");
        readBtn.innerText = "Read More";
        card_content.classList.remove("expanded-content");

        card_title.innerText = jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.title;
        card_content.innerHTML = jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.content;

        document.querySelector(".center-image-div").style.backgroundImage = "url(" + jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.img + ")";
        card_image.style.backgroundImage = "url(" + jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.img + ")";
        popupImage.style.backgroundImage = "url(" + jsonData[topic].sub_categories[sc_text_list[index].innerText].card_content.img + ")";
      }

      else {
        chosenTopicList.push(chosenTopic);
        chosenTopic = sc_text_list[index].innerText;

        handleLoadingAnimation(animationContainer);
        setTimeout(() => {
          document.querySelector("#circle-container").innerHTML = " ";
          handleInitialization(chosenTopic);
          readBtn.innerText = "Read More";
          card_content.classList.remove("expanded-content");
          handleNavHistory();
        }, 1000);
      }
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
        }
        else {
          clickHandler("sc", index);
        }
      })
    })
  });

  updateCentering(topic);
}


// .....
// Center the map based on screen width and height
// .....
const updateCentering = (topic) => {

  containerWidth = svgContainer.clientWidth;
  containerHeight = svgContainer.clientHeight;

  firstRadius = Math.min(containerWidth, containerHeight) / 8;
  secondRadius = Math.min(containerWidth, containerHeight) / 6;
  thirdRadius = Math.min(containerWidth, containerHeight) / 3;

  // ..... 
  // Centering Map
  d3.select(".top-g-node")
    .attr("transform", `translate(${containerWidth / 2} ${containerHeight / 2})`);

  // .....
  // Changing main circle radius
  d3.select(".main-circle")
    .attr("r", firstRadius);

  // .....
  // Changing inner circle radius
  d3.select(".inner-circle")
    .attr("r", secondRadius);

  // .....
  // Changing outer circle radius
  d3.select(".outer-circle")
    .attr("r", thirdRadius);

  // .....
  // Managing size of center image
  d3.select(".center-image-fo")
    .attr("width", firstRadius * 2)
    .attr("height", firstRadius * 2)
    .attr("transform", `translate(-${firstRadius} -${firstRadius})`);

  // .....
  // Changing transform position of categories
  for (let i = 0; i < categories_length; i++) {
    const angle = ((i / categories_length) * 360 - 45) * (Math.PI / 180);
    const x = secondRadius * Math.cos(angle);
    const y = secondRadius * Math.sin(angle);
    category_points[i] = [x, y];

    if (i >= categories_length / 2) {
      d3.select(".node-" + (i + 1))
        .attr("transform", `translate(${x} ${y}) rotate(140)`);
    }

    else {
      d3.select(".node-" + (i + 1))
        .attr("transform", `translate(${x} ${y}) rotate(-64)`);
    }
  }

  // .....
  // Changing transform position of subcategories
  let n = categories_length;
  for (let i = 0; i < sub_categories_length; i++) {
    const angle = ((i / sub_categories_length) * 360 - 80) * (Math.PI / 180);
    const x = thirdRadius * Math.cos(angle);
    const y = thirdRadius * Math.sin(angle);

    sub_category_points[i] = [x, y];

    const angleRadians = Math.atan2(y, x);
    const angleDegrees = (angleRadians * 180) / Math.PI;

    d3.select(".node-" + (n + 1))
      .attr("transform", `translate(${x} ${y}) rotate(${angleDegrees})`);

    n++;
  }

  // .....
  // Remapping Threads
  d3.selectAll(".g-thread").remove();
  for (let i = 0; i < categories_length; i++) {
    let sc_highlight_list = jsonData[topic].categories[c_text_list[i].innerText].sub_categories;

    for (let j = 0; j < sub_categories_length; j++) {
      for (let k = 0; k < sc_highlight_list.length; k++) {
        if (sc_text_list[j].innerText == sc_highlight_list[k]) {
          let curveData = [{ x: category_points[i][0], y: category_points[i][1] }, { x: sub_category_points[j][0], y: sub_category_points[j][1] }];
          let diagonal = d3.svg.diagonal()
            .source(function (d) { return { x: d[0].y, y: d[0].x }; })
            .target(function (d) { return { x: d[1].y, y: d[1].x }; })
            .projection(function (d) { return [d.y, d.x]; });

          threadsNode.append('g')
            .attr("class", "g-thread")
            .datum(curveData)
            .append('path')
            .attr("class", "thread thread-" + (i + 1))
            .attr('d', diagonal)
            .attr("stroke", "#0000001F")
            .attr("stroke-width", "1")
            .attr("fill", "none");
        }
      }
    }
  }

  // Threads
  setTimeout(() => {
    document.querySelectorAll(".thread").forEach(item => {
      item.classList.add("view-thread");
    });
  }, 1000);

  // Update the SVG width and height based on the container size
  // svgDOM.setAttribute('width', containerWidth);
  // svgDOM.setAttribute('height', containerHeight);
}


// .....
// Calling the main function - Initialization
// .....
handleInitialization(chosenTopic);


// .....
// Read more funtion for card content
// .....
readBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (readBtn.innerText == "Read More") {
    readBtn.innerText = "Read Less";
    card_content.classList.add("expanded-content");
  }
  else {
    readBtn.innerText = "Read More";
    card_content.classList.remove("expanded-content");
  }
});


// .....
// Navigation History
// .....
const handleNavHistory = () => {
  chosenTopicList = Array.from([...new Set(chosenTopicList)]);
  ulList.innerHTML = "";
  chosenTopicList.slice().reverse()
    .forEach(li => {
      ulList.innerHTML += `<li>${li}</li>`;
    });

  const listItem = document.querySelectorAll(".history-list li");
  listItem.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      chosenTopicList.push(chosenTopic);
      chosenTopicList = Array.from([...new Set(chosenTopicList)]);
      chosenTopic = item.innerText;

      handleLoadingAnimation(animationContainer);
      setTimeout(() => {
        document.querySelector("#circle-container").innerHTML = " ";
        handleInitialization(chosenTopic);

        readBtn.innerText = "Read More";
        card_content.classList.remove("expanded-content");
        chosenTopicList.splice(chosenTopicList.indexOf(chosenTopic), 1);

        handleNavHistory();

        dropDown.classList.remove("drop-show");
        navBtn.classList.remove("drop-focus");
      }, 1000);
    })
  })
}


// .....
// Event Listerners
// .....

// Navigation event listener
navBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dropDown.classList.toggle("drop-show");
  navBtn.classList.toggle("drop-focus");
});

// Card image event listener
card_image.addEventListener("click", (e) => {
  e.preventDefault();
  popupLayer.classList.remove("hidden");
  document.querySelector("body").classList.add("popup-show");
});

// Popup event listener
popupImage.addEventListener("click", (e) => {
  e.preventDefault();
  popupLayer.classList.add("hidden");
  document.querySelector("body").classList.remove("popup-show");
});

// Event listener to make the map respond to window resizing
window.addEventListener('resize', () => {
  clearTimeout(window.resizedFinished);
  window.resizedFinished = setTimeout(() => {
    updateCentering(chosenTopic);
  }, 250);
});

// Hide Panel event listener
hidePanelButton.addEventListener("click", e => {
  e.preventDefault();

  // .....
  // Effect on card
  card.classList.toggle("hide-card");

  // .....
  // Effect on hide-panel button, text & icon
  hidePanelButton.classList.toggle("panel-effect-button");
  hideIcon.classList.toggle("panel-effect-icon");

  // Effect on grid
  gridContainer.classList.toggle("panel-effect-grid");

  // .....
  // Effect on map centering & animation
  setTimeout(() => {
    if (hidePanelText.innerText == "Hide Panel") {
      hidePanelText.innerText = "Show Panel";
    }
    else {
      hidePanelText.innerText = "Hide Panel";
    }
    animationContainer.classList.toggle("panel-effect-animation");
    updateCentering(chosenTopic);
  }, 500);
})
