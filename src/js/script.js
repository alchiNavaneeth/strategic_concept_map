
// Declaring variables
let categories_length;
let sub_categories_length;
let categories = [];
let sub_categories = [];
let fill_image;
let jsonData;
// Get Data from the json file
await fetch("./data/data.json")
  .then(response => response.json())
  .then(data => {
    jsonData = data;
    categories_length = data.Map_Item_1.categories_list.length;
    sub_categories_length = data.Map_Item_1.sub_categories_list.length;
    categories = data.Map_Item_1.categories_list;
    sub_categories = data.Map_Item_1.sub_categories_list;
    fill_image = data.Map_Item_1.img
    // console.log(sub_categories);
  })

let category_points = []
let sub_category_points = []

// Select the SVG container
const svg = d3.select("#circle-container");
const curve = d3.line().curve(d3.curveNatural);
// Center of the circles
let centerX = 350;
let centerY = 300;




const mediaQuery = window.matchMedia('(max-width: 1250px)');
const mediaQuery1 = window.matchMedia('(max-width: 1200px)');
const mediaQuery2 = window.matchMedia('(max-width: 1150px)');
const mediaQuery3 = window.matchMedia('(max-width: 950px)');

const handleMediaQuery = (e) => {
  if (e.matches) {
    centerX = 320;
  }
}

const handleMediaQuery1 = (e) => {
  if (e.matches) {
    centerX = 300;
  }
}

const handleMediaQuery2 = (e) => {
  if (e.matches) {
    centerX = 450;
  }
}

const handleMediaQuery3 = (e) => {
  if (e.matches) {
    centerX = 400;
  }
}

mediaQuery.addListener(handleMediaQuery);
mediaQuery1.addListener(handleMediaQuery1);
mediaQuery2.addListener(handleMediaQuery2);
mediaQuery3.addListener(handleMediaQuery3);

handleMediaQuery(mediaQuery);
handleMediaQuery1(mediaQuery1);
handleMediaQuery2(mediaQuery2);
handleMediaQuery3(mediaQuery3);



// Radii for the circles
const firstRadius = 60;
const secondRadius = firstRadius + 30;
const secondTextRadius = firstRadius + 70;
const thirdRadius = secondRadius + 130;
const thirdTextRadius = secondRadius + 180;

// Fill color for the first circle
const fillColor = "blue";
// Stroke color and width for the second and third circles
const mainCircleStroke = "rgba(0,0,0,.3)";
const smallCircleStroke = "rgba(0,0,0,.6)";
const textColor = "rgba(0,0,0,.6)";
const backgroundColor = "#f2f2f2";
const strokeWidth = 2;

// const point1 = [[455, 222], [465, 190], [495, 155], [529, 122]];
// const point1 = [[455, 222], [529, 122]];

// svg.append('path')
//   .attr("d", curve(point1))
//   .attr("stroke", "#B0B0B0")
//   .attr("stroke-width", "1")
//   .attr("fill", "none");


// Append g class for threads
svg.append("g")
  .attr("class", "g-thread")

// Append the first circle filled with a color

svg.append("circle")
  .attr("id", "circle")
  .attr("class", "main-circle")
  .attr("cx", centerX)          // center x-coordinate
  .attr("cy", centerY)          // center y-coordinate
  .attr("r", firstRadius)       // first circle radius
  .attr("fill", "#011337");

svg.append("text")
  .attr("class", "main-circle-text")
  .text("Internet")
  .attr("x", centerX - 35)
  .attr("y", centerY + 3)
  .attr("font-weight", "600")
  .attr("font-size", "12")
  .attr("fill", "white");


// Append the second circle as a stroke line
svg.append("circle")
  .attr("cx", centerX)          // center x-coordinate
  .attr("cy", centerY)          // center y-coordinate
  .attr("r", secondRadius)      // second circle radius
  .attr("fill", "none")         // no fill
  .attr("stroke", mainCircleStroke)  // stroke color
  .attr("stroke-width", strokeWidth); // stroke width

// Append 6 stroked circles along the circumference of the second circle

for (let i = 0; i < categories_length; i++) {
  const angle = (i / categories_length) * Math.PI * 2;
  const x = centerX + secondRadius * Math.cos(angle);
  const y = centerY + secondRadius * Math.sin(angle);
  category_points[i] = [x, y]

  const textX = centerX + secondTextRadius * Math.cos(angle);
  const textY = centerY + secondTextRadius * Math.sin(angle);

  // Appending Circles
  svg.append("circle")
    .attr("class", "c-circle sc")   // c-circle stands for category-circle which represents the categories of the topic && sc for common class name
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 13)                  // radius of the stroked circles
    .attr("fill", backgroundColor)
    .attr("stroke", smallCircleStroke)
    .attr("stroke-width", strokeWidth);

  // Appending Catergories Content
  svg.append("text")
    .text(categories[i])
    .attr("class", "c-text")
    // .attr("text-anchor", "end")
    // .attr("alignment-baseline", "middle")
    // .attr("transform", "translate(" + textX + "," + textY + ") rotate(45)")
    .attr("x", textX - 15)
    .attr("y", textY)
    .attr("font-weight", "600")
    .attr("font-size", "13")
    .attr("fill", textColor);


  // TESTING START
  // svg.append("g")
  //   .attr("class", "node g-" + (i + 1))
  //   .attr("x", x)
  //   .attr("y", y);

  // const gElement = d3.select(".g-" + (i + 1))

  // gElement.append("g")
  //   .attr("class", "bounce g-bounce-" + (i + 1));

  // gElement.append("g")
  //   .attr("class", "text-container text-container-" + (i + 1));

  // const gBounce = d3.select(".g-bounce-" + (i + 1))
  // gBounce.append("circle")
  //   .attr("class", "c-circle sc")   // c-circle stands for category-circle which represents the categories of the topic && sc for common class name
  //   .attr("cx", x)
  //   .attr("cy", y)
  //   .attr("r", 13)                  // radius of the stroked circles
  //   .attr("fill", "#f2f2f2")
  //   .attr("stroke", smallCircleStroke)
  //   .attr("stroke-width", strokeWidth);



  // const textElement = d3.select(".text-" + (i + 1));
  // const gTextContainer = d3.select(".text-container-" + (i + 1));
  // gTextContainer.append("g")
  //   .attr("class", "inner-text-container inner-text-container-" + (i + 1))
  //   .attr("transform", "rotate(50)");

  // const gInnerTextContainer = d3.select(".inner-text-container-" + (i + 1));
  // gInnerTextContainer.append("g")
  //   .attr("class", "inner-inner-text inner-inner-text-" + (i + 1))
  //   .attr("transform", "rotate(50)")
  //   .attr("x", textX)
  //   .attr("y", textY);

  // const gText = d3.select(".inner-inner-text-" + (i + 1));
  // gText.append("foreignObject")
  //   .attr("class", "fo-" + (i + 1))
  //   .attr("x", textX)
  //   .attr("y", textY)
  //   .attr("width", "60")
  //   .attr("height", "30");

  // const foreignObject = d3.select(".fo-" + (i + 1))
  // foreignObject.append("div")
  //   .attr("class", "div-" + (i + 1))
  //   .attr("width", "40")
  //   .attr("height", "30")
  //   .text(categories[i])
  //   .attr("title", categories[i]);

  // TESTING END

}


// Append the third circle as a stroke line
svg.append("circle")
  .attr("cx", centerX)          // center x-coordinate
  .attr("cy", centerY)          // center y-coordinate
  .attr("r", thirdRadius)       // third circle radius
  .attr("fill", "none")         // no fill
  .attr("stroke", mainCircleStroke)  // stroke color
  .attr("stroke-width", strokeWidth); //

// Append 6 stroked circles along the circumference of the second circle
let textAngle = 0;

for (let i = 0; i < sub_categories_length; i++) {
  const angle = (i / sub_categories_length) * Math.PI * 2;
  const x = centerX + thirdRadius * Math.cos(angle);
  const y = centerY + thirdRadius * Math.sin(angle);
  sub_category_points[i] = [x, y]



  const textX = centerX + thirdTextRadius * Math.cos(angle);
  const textY = centerY + thirdTextRadius * Math.sin(angle);

  // Appending Circles
  svg.append("circle")
    .attr("class", "sc-circle sc")   // sc-circle stands for sub-category-circle which represents the sub categories of the categories && sc for common class name
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 10)               // radius of the stroked circles
    .attr("fill", backgroundColor)
    .attr("stroke", smallCircleStroke)
    .attr("stroke-width", strokeWidth);

  // Appending Sub-Categories Content
  svg.append("text")
    .text(sub_categories[i])
    .attr("class", "sc-text")
    .attr("x", textX - 15)
    .attr("y", textY)
    // .attr("transform", "translate(" + textX + "," + textY + ") rotate(" + textAngle + ")")
    .attr("font-weight", "600")
    .attr("font-size", "10")
    .attr("fill", textColor);

  textAngle = textAngle + 18;
}



const main_circle_text = document.querySelector(".main-circle-text");
let sub_highlight_contents;

const c_circles_list = document.querySelectorAll(".c-circle");
const sc_circles_list = document.querySelectorAll(".sc-circle");
const sc_text_list = document.querySelectorAll(".sc-text");
const c_text_list = document.querySelectorAll(".c-text");

const card_image = document.querySelector(".card-head-content");
const card_title = document.querySelector(".card-body-content h4");
const card_content = document.querySelector(".card-body-content p");

const gThread = d3.select(".g-thread");

// Threads Integration
for (let i = 0; i < categories_length; i++) {
  let sc_highlight_list = Object.keys(jsonData.Map_Item_1.categories[c_text_list[i].innerHTML].sub_categories);
  for (let j = 0; j < sub_categories_length; j++) {
    for (let k = 0; k < sc_highlight_list.length; k++) {
      if (sc_text_list[j].innerHTML == sc_highlight_list[k]) {
        let point1 = [category_points[i], sub_category_points[j]];
        gThread.append('path')
          .attr("class", "thread thread-" + (i + 1))
          .attr("d", curve(point1))
          .attr("stroke", mainCircleStroke)
          .attr("stroke-width", "1")
          .attr("fill", "none");
      }
    }
  }
}

const threadElements = document.querySelectorAll(".thread");
let specificThreadElements;

card_image.style.backgroundImage = "url(" + fill_image + ")";
main_circle_text.innerHTML = jsonData.Map_Item_1.topic;


// Categories Circle 
c_circles_list.forEach((circle, index) => {

  circle.addEventListener('click', e => {
    e.preventDefault();

    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight");
      c_text_list[i].classList.remove("highlight");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      threadElements[i].classList.remove("highlight-thread");
      sc_text_list[i].classList.remove("highlight");
      sc_circles_list[i].classList.remove("highlight");
    }

    specificThreadElements = document.querySelectorAll(".thread-" + (index + 1));

    let title = jsonData.Map_Item_1.categories[c_text_list[index].innerHTML].card_content.title;
    let content = jsonData.Map_Item_1.categories[c_text_list[index].innerHTML].card_content.content;

    card_title.innerText = title;
    card_content.innerText = content;
    circle.classList.add("highlight");
    c_text_list[index].classList.add("highlight");

    sub_highlight_contents = Object.keys(jsonData.Map_Item_1.categories[c_text_list[index].innerHTML].sub_categories);

    for (let j = 0; j < sc_text_list.length; j++) {
      for (let k = 0; k < sub_highlight_contents.length; k++) {
        if (sc_text_list[j].innerHTML == sub_highlight_contents[k]) {
          sc_text_list[j].classList.add("highlight");
          sc_circles_list[j].classList.add("highlight");
          specificThreadElements[k].classList.add("highlight-thread");
        }
      }
    }
  })
});

// Categories Circle text 
c_text_list.forEach((text, index) => {
  text.addEventListener('click', e => {
    e.preventDefault();

    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight");
      c_text_list[i].classList.remove("highlight");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      sc_text_list[i].classList.remove("highlight");
      sc_circles_list[i].classList.remove("highlight");
      threadElements[i].classList.remove("highlight-thread");
    }

    let specificThreadElements = document.querySelectorAll(".thread-" + (index + 1));
    let title = jsonData.Map_Item_1.categories[text.innerHTML].card_content.title;
    let content = jsonData.Map_Item_1.categories[text.innerHTML].card_content.content;

    card_title.innerText = title;
    card_content.innerText = content;
    c_circles_list[index].classList.add("highlight");
    text.classList.add("highlight");

    sub_highlight_contents = Object.keys(jsonData.Map_Item_1.categories[c_text_list[index].innerHTML].sub_categories);

    for (let j = 0; j < sc_text_list.length; j++) {
      for (let k = 0; k < sub_highlight_contents.length; k++) {
        if (sc_text_list[j].innerHTML == sub_highlight_contents[k]) {
          sc_text_list[j].classList.add("highlight");
          sc_circles_list[j].classList.add("highlight");
          specificThreadElements[k].classList.add("highlight-thread");
        }
      }
    }
  })
});



// Sub Categories Circle 
sc_circles_list.forEach((circle, index) => {
  circle.addEventListener('click', e => {
    e.preventDefault();

    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight");
      c_text_list[i].classList.remove("highlight");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      sc_circles_list[i].classList.remove("highlight");
      sc_text_list[i].classList.remove("highlight");
      threadElements[i].classList.remove("highlight-thread");
    }

    let title = jsonData.Map_Item_1.sub_categories[sc_text_list[index].innerHTML].card_content.title;
    let content = jsonData.Map_Item_1.sub_categories[sc_text_list[index].innerHTML].card_content.content;

    card_title.innerText = title;
    card_content.innerText = content;

    circle.classList.add("highlight");
    sc_text_list[index].classList.add("highlight");
  })
});

// Sub Categories Circle Text
sc_text_list.forEach((text, index) => {
  text.addEventListener('click', e => {
    e.preventDefault();

    for (let i = 0; i < c_circles_list.length; i++) {
      c_circles_list[i].classList.remove("highlight");
      c_text_list[i].classList.remove("highlight");
    }

    for (let i = 0; i < sc_circles_list.length; i++) {
      sc_circles_list[i].classList.remove("highlight");
      sc_text_list[i].classList.remove("highlight");
      threadElements[i].classList.remove("highlight-thread");
    }

    let title = jsonData.Map_Item_1.sub_categories[text.innerHTML].card_content.title;
    let content = jsonData.Map_Item_1.sub_categories[text.innerHTML].card_content.content;

    card_title.innerText = title;
    card_content.innerText = content;

    sc_circles_list[index].classList.add("highlight");
    text.classList.add("highlight");
  })
});
