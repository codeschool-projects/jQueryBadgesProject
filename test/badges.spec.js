// Libraries
const fs = require('fs');
const jsdom = require('jsdom');
const { assert } = require('chai');
const mockData = require('./response.mock');
const sinon = require('sinon');
const srcScript = fs.readFileSync('./src/assets/main.js', 'utf8');

const scriptRegex = /<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/ig;
const codeschoolRegex = /https:\/\/www\.codeschool\.com\/users\/\d+\.json/i;

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

      spy = sinon.stub(window.$, 'ajax', ({url, dataType, success}) => {

        if (!codeschoolRegex.test(url)) {
          // wrong url
        } else if (dataType !== 'jsonp') {
          // wrong dataType
        } else if (typeof success !== 'function') {
          // wrong success
        } else {
          success(mockData);
        }

        done()
      });

      // Adds script tag
      const scriptEl = window.document.createElement('script');
      scriptEl.appendChild(window.document.createTextNode(srcScript));
      window.document.body.appendChild(scriptEl);
    });

  });

  describe('the jQuery.ajax', () => {
    it('should call method', () => {
      assert(spy.called);
    });

    it('should call with an options object as argument', () => {
      assert(spy.calledWith(sinon.match.object));
    });

    it('should call with the url property', () => {
      assert(spy.calledWith(sinon.match.has('url')));
    });

    it('should call with the dataType property', () => {
      assert(spy.calledWith(sinon.match.has('dataType')));
    });

    it('should call with the success property', () => {
      assert(spy.calledWith(sinon.match.has('success')));
    });

    it('should call with correct URL', () => {
      assert(codeschoolRegex.test(spy.firstCall.args[0].url));
    });

    it('should call with jsonp dataType', () => {
      assert(spy.firstCall.args[0].dataType === 'jsonp');
    });

    it('should call with success function', () => {
      assert(typeof spy.firstCall.args[0].success === 'function');
    });
  });

  describe('the DOM', () => {
    let badges;
    before(() => badges = document.querySelector('#badges'));

    it('should have the #badges element', () => {
      assert(badges);
    });

    it('should have at least one child element', () => {
      let firstCourse = badges.firstChild;
      assert(!!firstCourse);
    });

    it('should have child with the course class name', () => {
      const firstCourse = badges.firstChild;
      const classes = Array.from(firstCourse.classList);
      assert(!!classes.find((className) => className === 'course'));
    });

    it('should have x elements within the #badges', () => {
      const courses = badges.childNodes;
      assert(courses.length === mockData.courses.completed.length)
    });

    it('should have h3 tags with the course titles', () => {
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const h3 = course.querySelector('h3');
        assert(!!h3);
        const titleRegex = new RegExp(mockData.courses.completed[i].title, 'i');
        assert(titleRegex.test(h3.textContent));
      });
    });

    it('should have an img with the badge url', () => {
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const img = course.querySelector('img');
        assert(!!img);
        assert(typeof img.src === 'string');
        assert(mockData.courses.completed[i].badge === img.src.toLowerCase().trim());
      });
    });

    it('should have an anchor pointing to the course url', () => {
      const courses = Array.from(badges.querySelectorAll('.course'));
      courses.forEach((course, i) => {
        const anchor = course.querySelector('a');
        assert(!!anchor);
        assert(typeof anchor.href === 'string');
        assert(mockData.courses.completed[i].url === anchor.href.toLowerCase().trim());
      });
    });

  });
});
