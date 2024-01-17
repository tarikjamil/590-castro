// ------------------ Split ------------------ //

function runSplit() {
  text = new SplitType("[animation=loading-split]", {
    types: "lines, chars",
    lineClass: "line-animation-split",
    charClass: "char-animation-split",
  });
  textfade = new SplitType("[animation=fade-split]", {
    types: "lines, chars",
    lineClass: "line-split-fade",
    charClass: "char-split-fade",
  });
  textheading = new SplitType("[animation=load--heading]", {
    types: "lines",
    lineClass: "animation-heading-split",
  });

  textquotes = new SplitType("[animation=quote-fade]", {
    types: "words",
    wordClass: "quote-fade-split",
  });

  // Wrap each line in a div with class 'overflow-hidden'
  $(".animation-heading-split").each(function () {
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
    textheading.revert();
    textquotes.revert();
    runSplit();
  }
});

// ------------------ gsap ------------------ //

gsap.registerPlugin(ScrollTrigger, CustomEase);

// ------------------ smooth scrolling ------------------ /

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

// ------------------ smooth ease ------------------ //

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
      ".loading--text-bottom",
      { y: "100%", opacity: 0, ease: "smooth", duration: 0.5 },
      "-=0.5"
    )
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

  const middleIndex = calculateMiddleIndex(
    ".line-animation-split .char-animation-split"
  );

  tl.from(
    ".line-animation-split:nth-child(2n+1) .char-animation-split",
    {
      y: "-100%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.05,
        startAt: { index: middleIndex },
      },
    },
    "+=0"
  ).from(
    ".line-animation-split:nth-child(2n+2) .char-animation-split",
    {
      y: "100%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.05,
        startAt: { index: middleIndex },
      },
    },
    "-=1"
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
  tl.from(
    ".circle--loading",
    {
      y: "20rem",
      opacity: 0,
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.1,
      },
    },
    "-=0.5"
  );
  function hideLoadingScreen() {
    gsap.to(".loading--screen", {
      onComplete: () => {
        document.querySelector(".loading--screen").style.display = "none";
      },
    });
  }
}

function calculateMiddleIndex(selector) {
  const elements = gsap.utils.toArray(selector);
  return Math.floor(elements.length / 2);
}

// ------------------ navbar ------------------ //

// navbar color
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

let menutrigger = document.querySelector(".navbar--menu-trigger");
let isMenuOpen = false;

menutrigger.addEventListener("click", function () {
  if (!isMenuOpen) {
    // Animate navlink from hidden to visible position
    gsap.fromTo(
      ".navlink",
      { y: "-100%" },
      {
        y: "0%",
        delay: 0.8,
        duration: 0.6,
        ease: "smooth",
        stagger: 0.05,
      }
    );

    // Animate navbar--text-left
    gsap.to(".navbar--text-left", {
      y: "-100%",
      delay: 0.8,
      duration: 0.6,
      ease: "smooth",
    });

    // Animate menu--close
    gsap.fromTo(
      ".menu--close",
      { x: "20rem", opacity: 0 },
      {
        x: "0rem",
        delay: 0.8,
        opacity: 1,
        duration: 0.6,
        ease: "smooth",
      }
    );
  } else {
    // Animate navlink from visible to hidden position
    gsap.to(".navlink", {
      y: "-100%",
      duration: 0.6,
      ease: "smooth",
      stagger: 0.05,
    });

    // Reverse animation for navbar--text-left
    gsap.to(".navbar--text-left", {
      y: "0%",
      duration: 0.6,
      ease: "smooth",
    });

    // Reverse animation for menu--close
    gsap.to(".menu--close", {
      x: "20rem",
      opacity: 0,
      duration: 0.6,
      ease: "smooth",
    });
  }
  isMenuOpen = !isMenuOpen;
});

$(".menu--close").on("click", function () {
  $(".navbar--menu-trigger").click();
});

$(".navlink").on("click", function () {
  $(".navbar--menu-trigger").click();
});

// ------------------ scroll trigger ------------------ //

document
  .querySelectorAll(".line-split-fade:nth-child(2n+1)")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".char-split-fade"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "bottom bottom",
        markers: false,
      },
      y: "-100%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.05,
      },
    });
  });

document
  .querySelectorAll(".line-split-fade:nth-child(2n+2)")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".char-split-fade"), {
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

document.querySelectorAll(".shinji--text.is--1st").forEach(function (element) {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
    x: "10vw", // Starting position of the animation
  });
});

document.querySelectorAll(".shinji--text.is--2nd").forEach(function (element) {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
    x: "-10vw", // Starting position of the animation
  });
});

document.querySelectorAll(".is--heja").forEach(function (element) {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
    x: "10vw", // Starting position of the animation
  });
});

document
  .querySelectorAll("._2011--score-item.is--1st")
  .forEach(function (element) {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        markers: false,
        scrub: true,
      },
      x: "-10vw", // Starting position of the animation
    });
  });

document
  .querySelectorAll("._2011--score-item.is--2")
  .forEach(function (element) {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        markers: false,
        scrub: true,
      },
      x: "10vw", // Starting position of the animation
    });
  });

document.querySelectorAll(".score--2012.is--1").forEach(function (element) {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
    x: "10vw", // Starting position of the animation
  });
});

document.querySelectorAll(".score--2012.is--2").forEach(function (element) {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
    x: "-10vw", // Starting position of the animation
  });
});
// ------------------ CIRCLE LOADING ------------------ //
gsap.to(".circle--loading", {
  scrollTrigger: {
    trigger: ".section--1",
    start: "top top",
    end: "bottom top",
    scrub: true,
    markers: false,
  },
  scale: 1.4,
  opacity: 0,
});

// ------------------ 2011 Intro images ------------------ //

document
  .querySelectorAll(".img--2011-intro:nth-child(2n+1")
  .forEach(function (element) {
    gsap.fromTo(
      element,
      { rotate: -3 },
      {
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          markers: false,
          scrub: true,
        },
        rotate: 3,
      }
    );
  });

document
  .querySelectorAll(".img--2011-intro:nth-child(2n+2")
  .forEach(function (element) {
    gsap.fromTo(
      element,
      { rotate: 3 },
      {
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          markers: false,
          scrub: true,
        },
        rotate: -3,
      }
    );
  });

// ------------------ key figures ------------------ //
gsap.from(".container--1344.is--keyfigures", {
  scrollTrigger: {
    trigger: ".container--1344.is--keyfigures",
    start: "top bottom",
    end: "top center",
    scrub: true,
    markers: false,
  },
  scale: 0.6,
});

// ------------------ santanaaaaaa ------------------ //
document
  .querySelectorAll(".shinji--text-wrapper.is--santana")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".shinji--text"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "top center",
        end: "bottom center",
        markers: false,
        scrub: true,
      },
      opacity: "0",
      stagger: {
        each: 0.05,
      },
    });
  });

// ------------------ transition ------------------ //
document
  .querySelectorAll(".transition--section")
  .forEach(function (fadeSplitElem) {
    gsap.to(fadeSplitElem.querySelectorAll(".transition--left"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "top center",
        end: "bottom top",
        markers: false,
        scrub: true,
      },
      height: "150%",
    });
  });

document
  .querySelectorAll(".transition--section")
  .forEach(function (fadeSplitElem) {
    gsap.to(fadeSplitElem.querySelectorAll(".transition--right"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "top bottom",
        end: "bottom top",
        markers: false,
        scrub: true,
      },
      height: "100%",
    });
  });

document
  .querySelectorAll(".transition--section")
  .forEach(function (fadeSplitElem) {
    gsap.to(fadeSplitElem.querySelectorAll(".circle--transition"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "top bottom",
        end: "top top",
        markers: false,
        scrub: true,
      },
      scale: "3",
    });
  });

// ------------------ quote fade ------------------ //
document
  .querySelectorAll("[animation=quote-fade]")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".quote-fade-split"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "top center+=100",
        end: "bottom center+=100",
        markers: false,
        scrub: true,
      },
      opacity: "0.1",
      stagger: {
        each: 0.05,
      },
    });
  });

// ------------------ finance image ------------------ //

gsap.to(".impact--img-wrapper", {
  scrollTrigger: {
    trigger: ".impact--img-wrapper",
    start: "top center",
    end: "bottom bottom",
    scrub: true,
    markers: false,
  },
  maxWidth: "100vw",
});

// ------------------ impact bar ------------------ //
document.querySelectorAll(".impact--bar").forEach(function (impactbar) {
  gsap.from(impactbar, {
    scrollTrigger: {
      trigger: impactbar,
      start: "bottom bottom",
      markers: false,
    },
    width: "0%",
    ease: "smooth",
    duration: 0.6,
  });
});

// ------------------ BORUSSIA FOOTER ------------------ //
document
  .querySelectorAll(".footer--borussia")
  .forEach(function (fadeSplitElem) {
    gsap.from(fadeSplitElem.querySelectorAll(".char-split-fade"), {
      scrollTrigger: {
        trigger: fadeSplitElem,
        start: "bottom bottom",
        markers: false,
      },
      y: "-130%",
      ease: "smooth",
      duration: 0.6,
      stagger: {
        each: 0.05,
      },
    });
  });
