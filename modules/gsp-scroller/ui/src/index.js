const anime = require('animejs').default;
//const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  const movementMin = 10;
  //const main = document.querySelector('.main');
  const sections = document.querySelectorAll('section');
  const intro = document.querySelector('#intro');
  const observer = new IntersectionObserver(sectionWatcher, { threshold: [0, .1] })
  const sectionYs = [];
  const cityBg = document.querySelector('[data-section-bg="city"]');
  
  let gspScrollActive = false;
  let w = window.innerWidth;
  let h = window.innerHeight;
  let pointerType = 'mouse';
  let previousSection = false;
  let nextSection = false;
  let activeSection = false;
  let activeSectionId = 0;
  let previousSectionId = 0;
  let nextSectionId =  1;
  let yPos = 0;
  let deltaY = 0;
  let incrementer = 0;
  let scrolling = false;
  let sectionLock = false;
  let sectionLockYStart = 0;
  let sectionLockYEnd = 0;

  window.addEventListener('scroll', sectionScrollListenerCallback);
  window.addEventListener('setscrollposition', setScrollPosition);
  window.addEventListener('unlocksections', unlockSections);

  window.addEventListener('pointerdown', determinePointerType);

  window.addEventListener('gspintroout', gspIn);
  window.addEventListener('gspintroin', gspOut);
  window.addEventListener('sectionintro', sectionIntro);
  window.addEventListener('sectionoutro', sectionExit);

  window.addEventListener('nextsection', sectionExit);
  window.addEventListener('previoussection', sectionExit);

  window.addEventListener('movedownaction', nextScrollDownTransition);
  window.addEventListener('moveupaction', nextScrollUpTransition);
  window.addEventListener('disablestandardscroll', disableStandardScroll);
  window.addEventListener('enablestandardscroll', enableStandardScroll);
  window.addEventListener('gsptransitioncomplete', transitionComplete);
  window.addEventListener('gsptransitionsactive', transitionsActive);

  function gspIn(e) {
    console.log('cityintro dispatch');
    cityBg.setAttribute('data-opacity', 1);

    sectionExit(e);
  }
  function gspOut(e) {
    cityBg.setAttribute('data-opacity', 0);
    sectionExit(e);
  }

  function sectionIntro(e) {
    activeSectionId = e.detail.section;
    const section = document.querySelector('[data-section="'+ activeSectionId +'"]');
    const id = section.getAttribute('id');
    let event = false;
    //section.classList.add('enabled');
    switch (id) {
      case 'intro':
      break;
      case 'collections':
        //event = new CustomEvent('collectionsintro');
        //disableStandardScroll();
        //scrolling = false;
      break;
      case 'theartist':
        //event = new CustomEvent('artistintro');
      case 'exhibitions':
      case 'press':
      case 'merchandise':
      default: 
      break;
    }

    /*
    anime({
      targets: section,
      opacity: 1,
      duration: 500,
      easing: 'easeInOutQuad',
      complete: function(anim) {
        if (event) {
          document.dispatchEvent(event);
        }
      } 
    });
    */
  }

  function transitionsActive(e) {
    //scrolling = true;
  }

  function transitionComplete(e) {
    //scrolling = false;
  }
  function scrollCallback(e) {
    if (gspScrollActive) {
      incrementer = window.scrollY - yPos;
      const id = activeSection.getAttribute('data-section');
      const bounds = sectionYs[id].bounds;
      const eventdown = new CustomEvent('movedownaction');
      const eventup = new CustomEvent('moveupaction');
      //scrollWindow(bounds.y);
      if (incrementer > 15) {
        //window.dispatchEvent(eventdown);
      }

      if (incrementer < -15) {
        //window.dispatchEvent(eventup);
      }
    }
  }
  function sectionExit(e) {
    console.log('sectionExit: ' + e.type);
    //scrolling = true;
    const eventType = e.type;
    const section = document.querySelector('[data-section="'+ activeSectionId +'"]');
    const pName = section.getAttribute('id');
    const totalSections = sections.length;

    switch (eventType) {
      case 'gspintroout':
        nextSectionId = 1;
      break;
      case 'gspintroin':
        nextSectionId = 0;
      break;
      case 'nextsection':
        nextSectionId = (nextSectionId === 5) ? 1 : nextSectionId + 1;
      break;
      case 'previoussection':
        nextSectionId = (nextSectionId === 1) ? 5 : nextSectionId - 1;
      break;
      default:
      break;
    }

    //fadeSectionOut(section);
  }

  function fadeSectionOut(section) {
    const isActive = section.classList.contains('enabled');
    const intro = new CustomEvent('sectionintro', {detail: {section: nextSectionId}});
    if (isActive) {
      anime({
        targets: section,
        opacity: 0,
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function(anim) {
          previousSectionId = activeSectionId;
          section.classList.remove('enabled');
          resetSectionStartPosition(section);
          window.dispatchEvent(intro);
        }
      });
    } else {
      window.dispatchEvent(intro);
    }
  }

  function resetSectionStartPosition(section) {
    const name = section.getAttribute('id');
    let event = false;
    switch (name) {
      case 'collections':
        event = new CustomEvent('collectionsreset');
      break;
      default: 
      break;
    }

    if (event) {
      document.dispatchEvent(event);
    }
  }

  function initializeGSPScroller() {
    document.body.setAttribute('data-gspscroller', 'off');
    if (sections && sections.length) {
      for(var s=0; s<sections.length; s++) {
        observer.observe(sections[s]);
        //const bounds = sections[s].getBoundingClientRect();
        //sectionYs[s] = {bounds: bounds }
      }
      //window.addEventListener('scroll', scrollCallback, {passive: false});
    }
  }

  function nextScrollDownTransition(e) {
    if (!scrolling) {
      console.log('nextScrollDownTransition');
      scrolling = true;
      let id = activeSection.getAttribute('data-section');
      const name = activeSection.getAttribute('id');
      const outro = new CustomEvent('sectionoutro');
      previousSection = activeSection;
      id++;
      activeSection = sections[id];
      console.log(activeSection);
      switch (name) {
        case 'intro':
          window.dispatchEvent(outro);
        case 'collections':
        default:
            /*
          id++;
          var newY = sectionYs[id].bounds.y;
          activeSection = sections[id];
          console.log(newY);
          console.log(window.scrollY);
          scrollWindow(newY);
          */
        break;
      }
    }
  }
  function nextScrollUpTransition(e) {
    if (!scrolling) {
      console.log('nextScrollUpTransition');
    }
    const id = activeSection.getAttribute('data-section');
    const fixScroll = new CustomEvent('enablestandardscroll');
    if (gspScrollActive && id === 0) {
      window.dispatchEvent(fixScroll);
    }
  }
  function disableStandardScroll(e) {
    //document.body.setAttribute('data-gspscroller', 'on');
    if (!gspScrollActive) {
      //gspScrollActive = true;
      //resetScrollY();
      switch(pointerType) {
        case 'touch':
        //window.addEventListener('touchmove', dragEventCallback);
        break;
        case 'mouse':
        //window.addEventListener('wheel', wheelEventCallback);
        break;
        default: 
        break;
      }
    
      if (!activeSection) {
        let introSection = sections[0];
        let bounds = introSection.getBoundingClientRect();
      }
    }
  }

  function dragEventCallback(e) {
    //console.log(e);
    if (e.type === 'touchmove') {
      //console.log(main.scrollTop);
    }
  }
  function wheelEventCallback(e) {
    deltaY += e.deltaY;
    let event = false;
    if (deltaY > 100) {
      deltaY = 0;
      event = new CustomEvent('nextsection'); 
    }

    if (deltaY < -100) {
      deltaY = 0;
      event = new CustomEvent('previoussection');
    }

    if (!scrolling && event) {
      window.dispatchEvent(event);
    }
  }

  function enableStandardScroll(e) {
    //document.body.setAttribute('data-gspscroller', 'off');
    //gspScrollActive = false;
  }

  function sectionWatcher(entries) {
    let activeEntry = false;
    if (entries && entries.length) {
      entries.forEach(entry => {
        const idx = entry.target.getAttribute('data-section');
        const id = entry.target.getAttribute('id');
        const ratio = entry.intersectionRatio;
        const target = entry.target;

        if (entry.boundingClientRect.height >= h) {
          if (entry.isIntersecting && !target.classList.contains('active')) {
            target.classList.add('active');
            const enable = new CustomEvent('enablesection', {detail: { section: target }});
            document.dispatchEvent(enable);
          }

          if (!entry.isIntersecting && target.classList.contains('active')) {
            target.classList.remove('active');
            const disable = new CustomEvent('disablesection', {detail: { section: target }});
            document.dispatchEvent(disable);
          }
          
          //activeEntry = entry.target;
        }
      });
    }

    if (activeEntry) {
      var event = new CustomEvent('sectionintro', { detail: { section: activeEntry }});
      window.dispatchEvent(event);
    }
  }

  function sectionScrollListenerCallback(e) {
    const activeSections = document.querySelectorAll('section.active');
    if (activeSections && activeSections.length) {
      activeSections.forEach(section => {
        const p = atPostion(section);

        if (sectionLock) {
          if (window.scrollY <= sectionLockYStart) {
            scrollWindow(sectionLockYStart);
          }
          if (window.scrollY >= sectionLockYEnd)
            scrollWindow(sectionLockYEnd);
        }

        if(!sectionLock) {
          if (p.rperc <= .25 && !section.classList.contains('visible')) {
            section.classList.add('visible');
          }
          if (p.rperc > .25 && section.classList.contains('visible')) {
            section.classList.remove('visible');
          }
          if (p.rspace <= 0 && section.classList.contains('visible')) {
            section.classList.remove('visible');
          }
        }
      });
    }
  }

  function atPostion(element) {
    const rect = element.getBoundingClientRect();
    return {
      rperc: rect.y/h,
      rspace: h + rect.y,
      rheight: rect.height - rect.y,
    }
  }

  function determinePointerType(e) {

    pointerType = e.pointerType;
  }
  function setScrollPosition(e) {
    const section = e.detail.section;
    const rect = section.getBoundingClientRect();
    scrollWindow(window.scrollY+rect.y);

    if (e.detail.locksections) {
      sectionLock = true;
      sectionLockYStart = window.scrollY;
      sectionLockYEnd = window.scrollY + (rect.height-h);
    }
  }
  function unlockSections(e) {
    sectionLock = false;
  }
  function resetScrollY() {
    yPos = 0;
  }
  function scrollWindow(y) {
    window.scrollTo({
      top: y,
      behavior: 'instant',
    });

  }

  apos.util.onReady(initializeGSPScroller);
}