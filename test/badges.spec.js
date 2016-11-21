// Libraries
const fs = require('fs');
const jsdom = require('jsdom');
const { assert } = require('chai');
const mockData = require('./response.mock');
const sinon = require('sinon');
const srcScript = fs.readFileSync('./src/assets/main.js', 'utf8');

const scriptRegex = /<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/ig;
const codeschoolRegex = /https:\/\/www\.codeschool\.com\/users\/.+\.json/i;

// HTML Page
let srcHtml = fs.readFileSync('./src/index.html', 'utf8');
srcHtml = srcHtml.replace(
  scriptRegex,
  (tag) => !/src\s*=['"][^'"]*assets\//i.test(tag) ? tag : ''
);

// JSDOM Setup
const virtualConsole = jsdom.createVirtualConsole();
virtualConsole.sendTo(console);

// Tests
describe('The webpage', () => {

  let document;
  let window;
  let spy;

  before((done) => {

    document = jsdom.jsdom(srcHtml, {
      virtualConsole: virtualConsole,
    });

    window = document.defaultView;

    window.addEventListener('load', () => {

      spy = sinon.stub(window.$, 'ajax', (url, settings) => {

        if (!settings) {
          settings = url;
          url = settings.url;
        }

        const {dataType, success} = settings;

        if (!codeschoolRegex.test(url)) {
          // wrong url
        } else if (dataType !== 'jsonp') {
          // wrong dataType
        } else if (typeof success !== 'function') {
          // wrong success
        } else {
          success(mockData);
        }

        done();
      });

      // Adds script tag
      const scriptEl = window.document.createElement('script');
      scriptEl.appendChild(window.document.createTextNode(srcScript));
      window.document.body.appendChild(scriptEl);
      setTimeout(()=> {
        done();
      }, 2000)
    });

  });

  describe('the jQuery.ajax should', () => {
    it('call method @ajax', () => {
      assert(spy.called, 'The `jQuery.ajax()` method needs to be called.');
    });

    it('call with an options object as argument @ajax', () => {
      assert(
        spy.calledWith(sinon.match.object) || spy.calledWith(sinon.match.string, sinon.match.object),
        '`jQuery.ajax()` needs to be called with the correct signature (string, object) or just an object.'
      );
    });

    it('call with the url property @ajax', () => {
      assert(spy.called, 'The `jQuery.ajax()` method needs to be called.');

      let url = spy.firstCall.args[0];
      let settings = spy.firstCall.args[1];

      if (!settings) {
        settings = url;
        url = settings.url;
      }

      assert(!!url, 'The `jQuery.ajax()` needs a `url` sent to it.');
    });

    it('call with correct URL @ajax', () => {
      assert(spy.called, 'The `jQuery.ajax()` method needs to be called.');

      let url = spy.firstCall.args[0];
      let settings = spy.firstCall.args[1];

      if (!settings) {
        settings = url;
        url = settings.url;
      }

      assert(codeschoolRegex.test(url), 'The URL sent to `jQuery.ajax` does not match the Code School API endpoint provided.');
    });

    it('call with the jsonp dataType property @ajax', () => {
      assert(spy.called, 'The `jQuery.ajax()` method needs to be called.');

      let url = spy.firstCall.args[0];
      let settings = spy.firstCall.args[1];

      if (!settings) {
        settings = url;
      }

      assert(settings.dataType, 'The object sent as an argument to `jQuery.ajax()` needs to contain a `dataType` field.');
      assert(settings.dataType === 'jsonp', 'The `dataType` sent to `jQuery.ajax()` needs to be `jsonp`');
    });

    it('call with the success property @ajax', () => {
      assert(spy.called, 'The `jQuery.ajax()` method needs to be called.');

      let url = spy.firstCall.args[0];
      let settings = spy.firstCall.args[1];

      if (!settings) {
        settings = url;
      }

      assert(settings.success, 'The object sent as an argument to `jQuery.ajax()` needs to contain a `success` callback.');
      assert(typeof settings.success === 'function', 'The `success` property sent to `jQuery.ajax()` needs to be a function.');
    });
  });

  describe('the DOM should', () => {
    let badges;
    before(() => badges = document.querySelector('#badges'));

    function hasFirstCourse() {
      assert(
        !!badges.firstChild,
        'Our `#badges` element does not have a `.course` child yet.'
      );
    }

    it('have the #badges element @course-elements', () => {
      assert(badges, 'Our page needs a `#badges` element.');
    });

    it('have at least one child element @course-elements', () => {
      hasFirstCourse();
    });

    it('have child with the course class name @course-elements', () => {
      hasFirstCourse();
      const firstCourse = badges.firstChild;
      const classes = Array.from(firstCourse.classList);
      assert(
        !!classes.find((className) => className === 'course'),
        'The immediate children to `#badges` need to have `course` as their CSS class.'
      );
    });

    it('have x elements within the #badges @course-elements', () => {
      hasFirstCourse();
      assert(badges, 'Our page needs a `#badges` element.');
      const courses = badges.childNodes;
      assert(
        courses.length === mockData.courses.completed.length,
        'We need a `.course` element for each item completed course in our AJAX response.'
      )
    });

    it('have h3 tags with the course titles @course-titles', () => {
      hasFirstCourse();
      assert(badges, 'Our page needs a `#badges` element.');
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const h3 = course.querySelector('h3');
        assert(!!h3, 'Each `.course` needs an `h3` tag.');

        const titleRegex = new RegExp(mockData.courses.completed[i].title, 'i');
        assert(
          titleRegex.test(h3.textContent),
          'Our course `h3` tags need to contain the title of the courses in the completed courses array.'
        );
      });
    });

    it('have an img with the badge url @course-images', () => {
      hasFirstCourse();
      assert(badges, 'Our page needs a `#badges` element.');
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const img = course.querySelector('img');
        assert(!!img, 'Our `.course` elements need to contain an `img` element.');
        assert(typeof img.src === 'string', 'Our course `img` elements need a `src` attribute.');
        assert(
          mockData.courses.completed[i].badge === img.src.toLowerCase().trim(),
          'The `src` attribute of our course images need to match the "course badge URL" that is returned from our API.'
        );
      });
    });

    it('have an anchor pointing to the course url @course-buttons', () => {
      hasFirstCourse();
      assert(badges, 'Our page needs a `#badges` element.');
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const anchor = course.querySelector('a');
        assert(!!anchor, 'Our `.course` elements need to contain an `a` element.');
        assert(typeof anchor.href === 'string', 'Our course `a` elements need an `href` attribute.');
        assert(
          mockData.courses.completed[i].url === anchor.href.toLowerCase().trim(),
          'Our course `a` elements need to point to the "Course URL" that is returned from our API.'
        );
      });
    });

  });
});
