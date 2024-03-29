function runSplit() {
  text = new SplitType("[animation=loading-split]", {
    types: "lines,chars",
    lineClass: "loading-animation-split",
    charClass: "loading-animation-split-char",
  });
  textfade = new SplitType("[animation=split-fade]", {
    types: "lines",
    lineClass: "animation-split-fade",
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

// On Page Load
function pageLoad() {
  let tl = gsap.timeline();

  tl.to(".main-wrapper", {
    opacity: 1,
    ease: "smooth",
    duration: 0.6,
  });

  // Add a label to mark the starting point of simultaneous animations
  tl.add("loadingAnimationsStart");

  // Existing animations
  tl.from(
    ".loading-animation-split-char",
    {
      y: "100%",
      opacity: "0",
      stagger: { each: 0.05, from: "start" },
      ease: "smooth",
      duration: 1,
    },
    "loadingAnimationsStart"
  );

  // New animation for .loading-animation-split after 5 seconds
  tl.to(".loading-animation-split-char", {
    y: "-100%",
    opacity: "0",
    stagger: { each: 0.05, from: "start" },
    ease: "smooth",
    duration: 1,
    delay: 5, // Delay of 5 seconds
  });
}

pageLoad();

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

gsap.utils.toArray("[animation=split-fade]").forEach((container) => {
  const splitFadeElements = container.querySelectorAll(".animation-split-fade");

  gsap.from(splitFadeElements, {
    scrollTrigger: {
      trigger: container,
      start: "top bottom", // When the top of the container hits the bottom of the viewport
      end: "bottom top", // When the bottom of the container leaves the top of the viewport
      toggleActions: "play none none none", // Play the animation when the container enters the viewport
      once: true, // Ensures the animation only triggers once
    },
    opacity: 0,
    y: "100%", // translateY
    duration: 0.6, // Duration of the animation
    ease: "smooth",
    delay: 0.3, // Custom easing function
    stagger: {
      amount: 0.1, // Total time for the stagger (in seconds)
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
