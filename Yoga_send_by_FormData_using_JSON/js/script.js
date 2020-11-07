window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
    
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }
    info.addEventListener('click', function(event) {   // повесили обработчик события на родителя
        if (event.target && event.target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {  // перебираем каждый элемент псевдомассива tab
                if (event.target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        } 
    });
    
    //таймер
    
    let deadlean = '2020-10-20';
    function getTimeRemaining(endTime) {   // шаг 3
        let t = Date.parse(endTime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000)%60),
            minutes = Math.floor((t/1000/60)%60),
            hours = Math.floor((t/1000/60/60));
            /*
                Если бы в таймере были ещё и дни
                days = Math.floor((t/1000/60/60/24));
                hours = Math.floor((t/1000/60/60)%24);

            */
        return {
            'totel': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setclock(id, endTime) {    // шаг 2 : срабатывает функция
        let timer = document.getElementById(id),      // получаем элементы из вёрстки
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000); // устанавливаем интервал в 1 секунду

        function updateClock() {
            let t = getTimeRemaining(endTime); // в t перед-ся рез-т ф-ии getTimeRemaining (объект)
            function addZero(num){
                if(num <= 9) {
                    return '0' + num;
                } else {
                    return num;
                }
            }
            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if(t.totel <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }
    setclock('timer', deadlean); 
    /* шаг 1
    вызываем ф-ию, в кот. передаём два параметра: 
    id родителя (блок, в котором в документе время) и дату дедлайна*/



    //Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close'),
        parentModalMore = document.querySelector('.info'),
        modalMore = parentModalMore.querySelectorAll('.description-btn');

    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';  // убрали воз-ть прокрутки пока открыто мод. окно
    });
    parentModalMore.addEventListener('click', function (event) {
        if (event.target && event.target.matches('div.description-btn')) {
            overlay.style.display = 'block';
            for (let i = 0; i < modalMore.length; i++) {
                modalMore[i].classList.add('more-splash');
            }
            document.body.style.overflow = 'hidden';  
        }
    });

    close.addEventListener('click', function(){
        overlay.style.display = 'none';
        document.body.style.overflow = '';  // отменили hidden
        if (more.classList.contains('more-splash') == true){
            more.classList.remove('more-splash');
        } else if (checkModalMore()) {
            for (let i = 0; i < modalMore.length; i++) {
                modalMore[i].classList.remove('more-splash');
            }
        }
    });
    function checkModalMore() {
        for (let i = 0; i < modalMore.length; i++) {
            if (modalMore[i].classList.contains('more-splash')) {
                return true;
            }
        }
    }


    // ПРИМЕР ИЗ УРОКА
    // function makeArr() {
    //     var items = [];
    //     for (let i =0; i < 10; i++) {
    //         var item = function(){
    //             console.log(i);
    //         };
    //         items.push(item);
    //     }
    //     return items;
    // }
    // var arr = makeArr();



    // Форма
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };
    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');
        statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) { // событие submit можно прикрутить только к форме (не к кнопке!!!!)
        event.preventDefault();
        form.appendChild(statusMessage);
        
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'appLication/json; charset=utf-8');
        // |^| настройка заголовка http-запроса
        /* далее нужно получить данные, которые ввел пользователь, самый простой метод 
        это сделать - воспользоваться встроенным обьектом FormData
        */ 
        let formDatd = new FormData(form);

        let obj = {};  // помещаем полученные данные в объект
        formDatd.forEach (function(value, key)  {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);  // превращаем объект в json формат
        request.send(json); //отправляем файл на сервер
       
        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState == 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }

        });

        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }

        

    });

});