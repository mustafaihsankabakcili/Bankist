'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');



///////////////////////////////////////
// MODAL WINDOW

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
    }
});



//////////////////////////////////////////////
// PAGE NAVIGATION
document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();

    if(e.target.classList.contains('nav__link')){
        const id = e.target.getAttribute('href');
        const goElement = document.querySelector(id); // Element that we want to go to

        goElement.scrollIntoView({behavior: 'smooth'});
    }
    
})



//////////////////////////////////////////////
// 'Learn More' BUTTON SCROLLING
btnScroolTo.addEventListener('click', function(e){
    section1.scrollIntoView({behavior: 'smooth'});
});



//////////////////////////////////////////////
// BUILDING TABBED COMPONENT
tabsContainer.addEventListener('click', (e) =>{
    const clicked = e.target.closest('.operations__tab');

    //Guard Clause
    if(!clicked) return;

    // Remove Active Classes
    tabs.forEach(tab => {
        tab.classList.remove('operations__tab--active');
    });

    tabsContent.forEach(content => {
        content.classList.remove('operations__content--active');
    });

    // Active tab and Content Area
    clicked.classList.add('operations__tab--active')
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

});




//////////////////////////////////////////////
// Navbar LINKS FADE ANIMATION
const handleHover = function(e, opacity){
    if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const siblings = link.closest('nav').querySelectorAll('.nav__link');
    
        siblings.forEach(el => {
            if (el !== link) el.style.opacity = opacity;
        });
    
    }
}

nav.addEventListener('mouseover', (e) =>{
    handleHover(e, 0.5);
});

nav.addEventListener('mouseout', (e) =>{
    handleHover(e, 1);
});



//////////////////////////////////////////////
// IMPLEMENTING A STICKY NAVIGATION: SCROLL EVENT
// THE INTERSECTION OBSERVER API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries){
    const [entry] = entries;
    if (entry.isIntersecting === false){
        nav.classList.add('sticky');
    } else{
        nav.classList.remove('sticky');
    };
}

const headerObserver = new IntersectionObserver( stickyNav,{
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);



//////////////////////////////////////////////
// REVEALING ELEMENTS ON SCROLL
// THE INTERSECTION OBSERVER API
const allSections = document.querySelectorAll('.section');


const revealSection = function(entries){
    const [entry] = entries;
    if(entry.isIntersecting === true){
        entry.target.classList.remove('section--hidden');
    } else {
        entry.target.classList.add('section--hidden');

    }

}

const sectionObserver = new IntersectionObserver(revealSection,{
    root: null,
    threshold: 0.15
});

allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden')
})



//////////////////////////////////////////////
// LAZY LOADING IMAGES
// THE INTERSECTION OBSERVER API
const imgTargets = document.querySelectorAll('img[data-src]');

const lazyLoad = function(entries){
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    if (entry.isIntersecting === true){
        entry.target.src = `${entry.target.dataset.src}`;
        entry.target.classList.remove('lazy-img');
    }

    imgObserver.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(lazyLoad, {
    root: null,
    threshold: 1
})

imgTargets.forEach(img => {
    imgObserver.observe(img);
});



//////////////////////////////////////////////
// SLIDER COMPONENT (CAROUSEL)
const slides = document.querySelectorAll('.slide');
const btnPrevious = document.querySelector('.slider__btn--left');
const btnNext = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');


// Functions
let currentSlide = 0;
const maxSlide = slides.length;

const createDots = () => {
    slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    })
}


const goToSlide = (currentSlide) => {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
}

const nextSlide = () => {
    if(currentSlide === maxSlide - 1){
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    
    goToSlide(currentSlide);
    activateDot(currentSlide);
}

const previousSlide = () => {
    if(currentSlide === 0){
        currentSlide = maxSlide - 1;
    } else {
        currentSlide--;
    }
    
    goToSlide(currentSlide);
    activateDot(currentSlide);
}

// Active Dot
const activateDot = (currentSlide) => {
    dotContainer.childNodes.forEach(slide => slide.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`).classList.add('dots__dot--active');
}

const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
}
init();


// Event Handlers
// Add translateX() to slides
slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * i}%)`;
})

// Right arrow button
btnNext.addEventListener('click', nextSlide);

// Left arrow button
btnPrevious.addEventListener('click', previousSlide);


// Arraw Keys
document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') previousSlide();
    if(e.key === 'ArrowRight') nextSlide();
})


// Add Functionality to Carousel Dots
dotContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('dots__dot')){
        const slide = e.target.dataset.slide;
        goToSlide(slide);
        activateDot(slide);
    }
})



// ASK AGAIN CLIENTS IF THEY REALLY WANT TO LEAVE THE PAGE 
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});