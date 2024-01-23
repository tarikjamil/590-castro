function runSplit() {
  text = new SplitType("[animation=loading-split]", {
    types: "lines,chars",
    lineClass: "loading-animation-split",
    charClass: "loading-animation-split-char",
  });
  textfade = new SplitType("[animation=split-fade]", {
    types: "lines,chars",
    lineClass: "animation-split-fade",
    charClass: "animation-split-char",
  });
  texttestimonial = new SplitType(".is--testimonial", {
    types: "lines,chars",
  });

  // Wrap each line in a div with class 'overflow-hidden'
  $(".loading-animation-split").each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>");
  });
  $(".animation-split-fade").each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>");
  });
}

runSplit();

// Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    text.revert();
    textfade.revert();
    texttestimonial.revert();
    runSplit();
  }
});

gsap.registerPlugin(ScrollTrigger, CustomEase);

let smoother;

function initializeScrollSmoother() {
  if (!smoother) {
    gsap.registerPlugin(ScrollSmoother);

    // Check if the screen width is below 991px
    const shouldEnableEffects = window.innerWidth >= 991;

    smoother = ScrollSmoother.create({
      smooth: 1,
      effects: shouldEnableEffects, // Enable or disable based on screen width
    });
  }
}

function updateOnResize() {
  // Check if smoother instance exists
  if (smoother) {
    // Update the effects property based on the current window width
    smoother.effects(window.innerWidth >= 991);

    // Update the smoother instance
    if (smoother.update) {
      smoother.update();
    }
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

// Initialize ScrollSmoother on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeScrollSmoother);

// Add debounced resize event listener
window.addEventListener("resize", debounce(updateOnResize, 250));

CustomEase.create("smooth", "M0,0 C0.38,0.005 0.215,1 1,1");

// ------------------ loading screen ------------------ //

document.addEventListener("DOMContentLoaded", function () {
  const progressBar = document.querySelector(".loading--line");
  let totalImages = document.images.length;
  let imagesLoaded = 0;

  function updateProgress() {
    let progress = (imagesLoaded / totalImages) * 100;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      // Call the animation function when progress bar hits 100%
      onLoadingComplete();
    }
  }

  function imageLoaded() {
    imagesLoaded++;
    updateProgress();
  }

  for (let img of document.images) {
    img.removeAttribute("loading"); // Remove lazy loading

    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener("load", imageLoaded);
      img.addEventListener("error", imageLoaded);
    }
  }

  // Rest of your code for reapplyLazyLoading and isInViewport
  // ...
});

function onLoadingComplete() {
  const tl = gsap.timeline();

  // Animate individual elements with timeline
  tl.to(".loading--logo", { delay: 1, y: "-20rem", opacity: 0, ease: "smooth" })
    .to(
      ".loading--line-parent",
      { y: "-10rem", opacity: 0, ease: "smooth", duration: 0.5 },
      "-=0.2"
    )
    .to(
      ".loading--screen",
      { scale: 0.6, ease: "smooth", duration: 0.5 },
      "-=0.5"
    )
    .to(
      ".loading--screen-container",
      {
        height: "0vh",
        ease: "smooth",
        duration: 0.5,
        onComplete: hideLoadingScreen,
      },
      ">"
    );

  tl.from(
    ".loading-animation-split-char",
    {
      y: "100%",
      opacity: "0",
      stagger: { each: 0.05, from: "start" },
      ease: "smooth",
      duration: 1,
    },
    "+=0"
  );

  tl.from(
    ".animation-heading-split",
    {
      y: "100%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.1,
      },
    },
    "-=0.5"
  );

  tl.to(".animation-heading-split", {
    y: "-100%",
    opacity: "0",
    stagger: { each: 0.1, from: "start" },
    ease: "smooth",
    duration: 0.6,
    delay: 5, // Delay of 5 seconds
  });

  function hideLoadingScreen() {
    gsap.to(".loading--screen", {
      onComplete: () => {
        document.querySelector(".loading--screen").style.display = "none";
      },
    });
  }
}

// marquee is--scrolling
const scrollSpeed = 50; // pixels per second, adjust as needed

function updateScrollingSpeed() {
  document.querySelectorAll(".is--scrolling").forEach((element) => {
    const scrollWidth = element.offsetWidth;
    const duration = scrollWidth / scrollSpeed; // seconds

    element.style.setProperty("--scroll-width", `${scrollWidth}px`);
    element.style.animationDuration = `${duration}s`;
  });
}

// Call initially
updateScrollingSpeed();

// Update on window resize
window.addEventListener("resize", updateScrollingSpeed);

// -------------- scroll trigger -------------- //
document
  .querySelectorAll(".animation-split-fade")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".animation-split-char"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "bottom bottom",
        markers: false,
      },
      y: "100%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.05,
      },
    });
  });

//------------ scroll navbar ------------ //

$(document).ready(function () {
  var scrollTop = 0;
  $(window).scroll(function () {
    scrollTop = $(window).scrollTop();
    if (scrollTop >= 50) {
      $(".navbar--bg").addClass("is--scrolled");
    } else if (scrollTop < 50) {
      $(".navbar--bg").removeClass("is--scrolled");
    }
  });
});

//------------ map ------------ //

$(".switch--parent").on("click", function () {
  $(this).find(".switch--element").toggleClass("is--active");
  $(".height").toggleClass("is--active");
  $(".plan-image").toggleClass("is--active");
});

//------------ text move from left to right ------------ //

// Select all elements with the 'animation:textleft' attribute
document.querySelectorAll('[animation="textleft"]').forEach((element) => {
  gsap.fromTo(
    element,
    { x: "1em" }, // starting position
    {
      x: "-1em", // ending position
      scrollTrigger: {
        trigger: element,
        start: "top bottom", // start animation when the top of the element hits the top of the viewport
        end: "bottom top", // end animation when the bottom of the element hits the top of the viewport
        scrub: true, // smooth scrubbing, consider adjusting or removing for instant changes
        markers: false, // for debugging, remove when done
      },
    }
  );
});

document.querySelectorAll('[animation="textright"]').forEach((element) => {
  gsap.fromTo(
    element,
    { x: "-1em" }, // starting position
    {
      x: "1em", // ending position
      scrollTrigger: {
        trigger: element,
        start: "top bottom", // start animation when the top of the element hits the top of the viewport
        end: "bottom top", // end animation when the bottom of the element hits the top of the viewport
        scrub: true, // smooth scrubbing, consider adjusting or removing for instant changes
        markers: false, // for debugging, remove when done
      },
    }
  );
});

//------------ testimonial ------------ //

document.querySelectorAll(".is--testimonial").forEach((testimonial) => {
  const chars = testimonial.querySelectorAll(".char"); // select all .char elements within .is--testimonial

  gsap.fromTo(
    chars,
    { color: "var(--white)" },
    {
      color: "var(--gold)", // assuming you have defined this variable in your CSS
      stagger: 0.05, // adjust the stagger timing as needed
      scrollTrigger: {
        trigger: testimonial,
        start: "top bottom -=100", // start animation when the top of the testimonial is at the center of the viewport
        end: "bottom center", // end animation when the bottom of the testimonial is at the center
        scrub: true, // smooth scrubbing effect, adjust as needed
        markers: false, // for debugging, can be removed later
      },
    }
  );
});

//------------ text move from left to right ------------ //
// Check if the screen width is greater than 992px
if (window.innerWidth > 992) {
  // Apply the animation to elements with the class .timber-row.is--1
  document.querySelectorAll(".timber-row.is--1").forEach((element) => {
    gsap.fromTo(
      element,
      { x: "0em" },
      {
        x: "-6em",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      }
    );
  });

  // Apply the animation to elements with the class .timber-row.is--2
  document.querySelectorAll(".timber-row.is--2").forEach((element) => {
    gsap.fromTo(
      element,
      { x: "0em" },
      {
        x: "6em",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      }
    );
  });
}

//------------ navbar ------------ //
$(".menu--bg").on("click", function () {
  $(".menu--link").click();
});

$(".navlink").on("click", function () {
  $(".menu--link").click();
});

$(".menu--close--icon").on("click", function () {
  $(".menu--link").click();
});
