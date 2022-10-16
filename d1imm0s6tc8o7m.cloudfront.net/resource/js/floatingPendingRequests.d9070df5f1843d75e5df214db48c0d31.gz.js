"use strict";
if(!window.mobileAndTabletcheck()) {
  (function (forEachTag, waitFor) {

    var settings = {
      method: 'interval',
      once: true,
    };

    waitFor(
        '.sidebar .accordion',
        function (accordion) {
          accordion.insertAdjacentHTML(
              'afterbegin',
              '\n      <div class="pending-request-sidebar">\n        <div class="pending-request-sidebar__inner">\n          <h3 class="accordionTitle open request-sidebar-title">\n            <a onclick="scroll()" href="#">PENDING REQUESTS</a>\n          </h3>\n          <div class="accordionContent open request-sidebar-container">\n            <h3>'.concat(
                  'You have <span class="number-of-pending-requests"></span> pending requests:',
                  '</h3>\n            <div class="request-sidebar">\n\n            </div>\n            <a href="/request-information/" class="btn button side_bar_button">COMPLETE YOUR REQUESTS&nbsp;\u2192</a>\n          </div>\n        </div>\n      </div>\n    '
              )
          );
          document
              .querySelector('.pending-request-sidebar__inner .accordionTitle')
              .addEventListener('click', function (e) {
                e.preventDefault();
                scroll();
                document
                    .querySelector('.pending-request-sidebar__inner .accordionTitle')
                    .classList.toggle('open');
                document
                    .querySelector('.pending-request-sidebar__inner .accordionContent')
                    .classList.toggle('open');
                document.querySelector('.pending-request-sidebar').style.height =
                    'auto';
              });
          var contentWrapEl = document.querySelector('.contentWrap');
          var el = document.querySelector('.pending-request-sidebar');
          var elInner = document.querySelector('.pending-request-sidebar__inner');

          window.addEventListener('scroll', function () {

            var contentWrapPos =
                getOffset(contentWrapEl).top + contentWrapEl.offsetHeight;
            el.style.height = 'auto';
            elInner.style.width = 'auto';
            el.style.minHeight = elInner.offsetHeight + 'px';
            elInner.style.width = el.offsetWidth + 'px';

            let pos = 0;
            if ($(document).find(".up_menu").length > 0) {
              $('.pending-request-sidebar.is-fixed .pending-request-sidebar__inner').css('top', '73px');
            }
            if ((window.pageYOffset + pos) > (getOffset(el).top)) {

              if (window.pageYOffset + elInner.offsetHeight + 60 < contentWrapPos) {

                el.classList.remove('is-absolute');
                el.classList.add('is-fixed');
              } else {
                el.classList.remove('is-fixed');
                el.classList.add('is-absolute');
              }

              el.style.minHeight = elInner.offsetHeight + 'px';
              elInner.style.width = el.offsetWidth + 'px';
            } else {
              el.classList.remove('is-absolute');
              el.classList.remove('is-fixed');
              el.style.height = 'auto';
              elInner.style.width = 'auto';
            }
          });

          function getOffset(el) {
            const rect = el.getBoundingClientRect();
            return {
              left: rect.left + window.scrollX,
              top: rect.top + window.scrollY,
            };
          }

          waitFor(
              '#requestBarText',
              function (target) {
                updateRequestSidebar();
                var observer = new MutationObserver(updateRequestSidebar);
                var config = {
                  characterData: false,
                  attributes: false,
                  childList: true,
                  subtree: false,
                };
                observer.observe(target, config);
              },
              settings
          );
        },
        settings
    );

    function updateRequestSidebar() {
      var items = JSON.parse(localStorage.getItem('franchiseIdsArr'));
      items = items.reverse();

      if (items.length == 0) {
        document
            .querySelector('.request-sidebar-title')
            .setAttribute('style', 'display: none !important;');
        document
            .querySelector('.request-sidebar-container')
            .setAttribute('style', 'display: none !important;');
      } else {
        document
            .querySelector('.request-sidebar-title')
            .setAttribute('style', '');
        document
            .querySelector('.request-sidebar-container')
            .setAttribute('style', 'display: none;');

        if (items.length == 1) {
          document.querySelector('.request-sidebar-title a').innerHTML =
              'PENDING REQUEST';
          document.querySelector(
              '.request-sidebar-container a.button'
          ).innerHTML = 'COMPLETE YOUR REQUEST&nbsp;→';
        } else {
          document.querySelector('.request-sidebar-title a').innerHTML =
              'PENDING REQUESTS';
          document.querySelector(
              '.request-sidebar-container a.button'
          ).innerHTML = 'COMPLETE YOUR REQUESTS&nbsp;→';
        }
      }

      document.querySelector('.number-of-pending-requests').innerHTML =
          items.length;

      if (items.length == 1) {
        document.querySelector(
            '.request-sidebar-container h3'
        ).innerHTML = document
            .querySelector('.request-sidebar-container h3')
            .innerHTML.replace('requests:', 'request:');
      } else {
        document.querySelector(
            '.request-sidebar-container h3'
        ).innerHTML = document
            .querySelector('.request-sidebar-container h3')
            .innerHTML.replace('request:', 'requests:');
      }


      var imageDiv = document.querySelector('.request-sidebar');
      imageDiv.innerHTML = '';

      for (var i = 0; i < items.length; i++) {
        imageDiv.insertAdjacentHTML(
            'beforeend',
            '\n        <label>\n          <a href="#" data-item="'
                .concat(
                    items[i],
                    '" class="sel"></a>\n          <div class="company-logo-preview" style="background-image: url(https://www.franchisedirect.com/profile/image?id='
                )
                .concat(items[i], ')">\n          </div>\n        </label>\n      ')
        );
      }

      forEachTag('.request-sidebar label a', function (label) {
        label.addEventListener('click', function (e) {
          e.preventDefault();
          this.classList.toggle('sel');
          var currentItem = this.getAttribute('data-item');
          var list = JSON.parse(localStorage.getItem('franchiseIdsArr'));

          if (this.classList.contains('sel') && list.indexOf(currentItem) == -1) {
            list.push(currentItem);
          } else if (list.indexOf(currentItem) > -1) {
            list.splice(list.indexOf(currentItem), 1);
          }

          localStorage.setItem('franchiseIdsArr', JSON.stringify(list));

          if (document.querySelectorAll('#requestBarText').length) {
            document.querySelector(
                '#requestBarText'
            ).innerHTML = 'You have '
                .concat(list.length, ' pending request')
                .concat(list.length > 1 ? 's' : '');
          }


          document.querySelector('.number-of-pending-requests').innerHTML =
              list.length;


          if (list.length == 0) {
            document
                .querySelector('.request-sidebar-title')
                .setAttribute('style', 'display: none !important;');
            document
                .querySelector('.request-sidebar-container')
                .setAttribute('style', 'display: none !important;');
          } else {
            document
                .querySelector('.request-sidebar-title')
                .setAttribute('style', '');
            document
                .querySelector('.request-sidebar-container')
                .setAttribute('style', 'display: none;');
          }
          /* A hack to fix the selected items in the listing */

          document
              .querySelector('.card.franchise:not(.sel)')
              .classList.add('toggle-this-one');
          document.querySelector('.toggle-this-one label.req').click();
          setTimeout(function () {
            document.querySelector('.toggle-this-one label.req').click();
            document
                .querySelector('.toggle-this-one')
                .classList.remove('toggle-this-one');
          }, 150);

          fd.updateFranchises(false);
        });
      });
      var el = document.querySelector('.pending-request-sidebar');
      var elInner = document.querySelector('.pending-request-sidebar__inner');
      el.style.height = 'auto';
      elInner.style.width = 'auto';
      el.style.minHeight = elInner.offsetHeight + 'px';
      elInner.style.width = el.offsetWidth + 'px';
    }

    document.documentElement.appendChild(
        document.createElement('style')
    ).textContent = [
      '.request-sidebar-container {',
      '  padding: 10px 10px 20px 10px;',
      '  border: 1px solid #d9d8d7;',
      '  border-top: 0;',
      '}',
      '.request-sidebar-container h3 {',
      '  margin-top: 5px;',
      '  font-weight: bold;',
      '  color: #152b40;',
      '}',
      '.request-sidebar-container .btn {',
      '  background: #ffa000;',
      '  color: #152c40;',
      '  font-weight: bold;',
      '  padding-left: 10px;',
      '  padding-right: 10px;',
      '  width: 100%;',
      '}',
      '.request-sidebar {',
      '  max-height: 50vh;',
      '  overflow: scroll;',
      '  margin-bottom: 10px;',
      '}',
      '.request-sidebar .company-logo-preview {',
      '  width: 100%;',
      '  height: 90px;',
      '  background-repeat: no-repeat;',
      '  background-position: top left;',
      '  background-size: contain !important;',
      '  vertical-align: middle;',
      '  display: inline-block;',
      '  text-indent: -9999px;',
      '}',
      '.request-sidebar label {',
      '  display: flex;',
      '  align-items: center;',
      '}',
      '.request-sidebar label a {',
      '  font-family: FontAwesome;',
      '  font-weight: normal;',
      '  font-style: normal;',
      '  color: inherit;',
      '  display: inline-block;',
      '  padding-right: 10px;',
      '  width: 30px;',
      '  font-size: 24px;',
      '  position: relative;',
      '  top: 2px;',
      '  flex-shrink: 0;',
      '  text-decoration: none;',
      '}',
      '.request-sidebar label a:before {',
      "  content: '';",
      '}',
      '.request-sidebar label a.sel:before {',
      "  content: '';",
      '}',
      '.pending-request-sidebar__inner {',
      '  background-color: #fff;',
      '}',
      '.pending-request-sidebar.is-fixed .pending-request-sidebar__inner {',
      '  position: fixed;',
      '  top: 0;',
      '  z-index: 10;',
      '}',
      '.pending-request-sidebar__inner {',
      '  border-top: 10px solid #fff;',
      '}',
      '.pending-request-sidebar__inner h3 {',
      '  margin-top: 0;',
      '}',
      '.contentWrap .sidebar {',
      '  position: static !important;',
      '}',
      '.pending-request-sidebar.is-absolute .pending-request-sidebar__inner {',
      '  position: absolute;',
      '  bottom: 60px;',
      '  z-index: 10;',
      '}'
    ].join('\n');
  })(
      function (selector, callback) {
        return Array.prototype.slice
            .call(document.querySelectorAll(selector))
            .forEach(function (tag, count, index) {
              return callback(tag, count, index);
            });
      },
      function (target, callback, options) {
        // Default settings
        var settings = {
          method: 'mutation',
          // mutation | interval | animation
          once: true,
          options: {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: false,
          },
        }; // Update settings with supplied configuration

        for (var option in options) {
          settings[option] = options[option];
        } // Mutation Observer

        if (settings.method === 'mutation') {
          function mutationCallback(mutationList, observer) {
            return mutationList.forEach(function (mutation) {
              callback(mutation);

              if (settings.once) {
                observer.disconnect();
              }
            });
          } // Accept either DOM node or selector for target

          if (typeof target === 'string') {
            target = document.querySelector(target);
          }

          var observer = new MutationObserver(mutationCallback);
          observer.observe(target, settings.options);
        } // Set Interval

        if (settings.method === 'interval') {
          function intervalCallback() {
            if (document.querySelector(target)) {
              callback(document.querySelector(target));
              clearInterval(observer);
            }
          }

          var observer = setInterval(intervalCallback, 1000 / 60);
        } // Request Animation Frame

        if (settings.method === 'animation') {
          function animationCallback() {
            if (document.querySelector(target)) {
              callback(document.querySelector(target));
            } else {
              window.requestAnimationFrame(animationCallback);
            }
          }

          window.requestAnimationFrame(animationCallback);
        }
      }
  );

}
function scroll(){
  $(window).scrollTop(window.pageYOffset+10);
}
