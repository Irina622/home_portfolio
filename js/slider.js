/**
 * Slider Version 4.01.2019.08.30
 * 
 * Описание возможностей: 
 * 1. Каждый слайд движется индивидуально. Движение: CSS (@keyframes) - генерируется дополнительная stylesheet сугубо под нужды слайдера.
 * 2. Режимы работы (помимо изменения числовых значений):
 * 2.1 органы пользовательского управления: кнопки "Влево", "Вправо" (есть возможность одновременного вкл/выкл кнопок "Влево" и "Вправо" см.Slider_Manual), а также клик по слайду
 * 2.2 поддерживаются такие режимы: "движение бесконечно вправо до клика", "движение бесконечно влево до клика", "пауза", "движение вправо на 1 слайд и автопауза", "движение влево на 1 слайд и автопауза"
 * 2.3 
 * 3. Требования к элементам CSS (особенности CSS):
 * 3.1 контейнер слайдера <div id="wrapperSliderV4"> (для изменения id см.Slider_nameWrapper):
 * 	box-sizing: border-box;
 * 	display: block;
 *	overflow: hidden;
 *	padding: 0;	допускается ненулевые padding-left и padding-right, но требует дополнительной проверки
 * 3.2 отдельный слайд <div class="slide"> (для изменения класса см.Slider_classSlide):
 * 	position: relative;
 *	width - задаётся из js-скрипта
 * 	height: 100%;
 * 	display: block;
 * 	box-sizing: border-box;
 *	z-index - задаётся из js-скрипта (см.zindexVis, zindexUnVis), без учета введённых данных в css
 * 3.3 контейнер элементов управления слайдером <div class="slider_tool"> (для изменения класса см.Slider_nameTool):
 * 	display: block;
 * 	background-color: transparent;
 * 	box-sizing: border-box;
 *	height: должен совпадать по размеру с height кнопок "Влево" и "Вправо"
 * 	position: relative;
 *	z-index: [default]=45; можно менять, с условием, что должно быть больше zindexVis и zindexUnVis, а также z-index любого html-элемента на слайде, но меньше z-index кнопок "Влево" и "Вправо"
 *	margin-top - задаётся из js-скрипта (default = центр слайдера), допускается ручная установка при любом значении отличном от нуля
 * 3.4 кнопки управления "Влево" и "Вправо" <div class="slider_toolArroyL"> и <div class="slider_toolArroyR"> (нет возможности изменения class):
 * 	display: block;
 * 	box-sizing: border-box;
 * 	position: relative;
 *	z-index: [default]=50; можно менять, с условием, что должно быть больше zindexVis и zindexUnVis
 *	float: [left || right]; соответственно для кнопок "Влево" и "Вправо"
 *	возможность установки своей надписи [см.nameBtnLeft, hintBtnRight] на кнопках
 *	возможность установки своего title [см.hintBtnLeft, hintBtnRight] на кнопках
 *	margin-top: [default]0; возможность установки вертикального смещения относительно slider_tool, как +, так и -
 *	margin-left, margin-right, margin-bottom - не реагирует
 * 4. Дополнительные условия:
 * 4.1 Slider_slideCountVisual меньше, либо равен Slider_slideCount
 * 4.2 Для slider_toolArroyL:hover и slider_toolArroyR:hover не рекомендуется использовать box-shadow
 */

/*BEGIN Блок <Объявления и начальная инициализация Глобальных переменных>*/
/*BEGIN Блок <Вспомогательные - переопределяются из input[type=hidden]>*/
var outerCSSLinks = 1;//имеющееся число таблиц CSS в документе (до начала работы слайдера): каждый 'link rel="stylesheet"'=>+1; каждый тег '<style>'=>+1
var Slider_slideCountVisual = 2;//целое единовременно видимое число слайдов на экране
var Slider_slideCount = 2;//общее число слайдов
var Slider_Manual = 1;//Наличие кнопок ручного управления: [1] - есть; [любое прочее, не равное 0] - нет
var Slider_TimeWait = 5000;//Задержка между циклами, милисек, 1000мсек = 1сек
var Slider_Time = 5000;//Время анимации, милисек, 1000мсек = 1сек
var Slider_OnlyOne = 0;//Проигрывать шоу только 1 раз, [1] - Да; [любое прочее, не равное 0] - нет
var animationTimingFunction = 'ease-out';//временная функция пролистывания кадров animation-timing-function (CSS)
var Slider_nameWrapper = 'wrapperSliderV4';//div-приёмник слайдера [string]
var Slider_classSlide = 'slide';//class слайда [string]
var Slider_nameTool = 'slider_tool';//div-приёмник слайдера [string]
var zindexVis	= 25;//z-index верхнего (видимого) слайда
var zindexUnVis	= 5;//z-index нижнего (невидимого) слайда
/*END Блок <Вспомогательные - переопределяются из input[type=hidden]>*/

/*BEGIN Блок <Внутренние>*/
var wSheet = null;//рабочая CSS-таблица
var Slider_slideUser = [];//массив слайдов от пользователя: type [object HTMLElement]
var slidersDIV	= [];//массив слайдов - полный: type [object HTMLDivElement]
var sliders_work = [];//список отображаемых на текущий момент слайдов: type [object HTMLDivElement]
var nameBtnLeft	= 'Left';//текст в кнопке выбора направления слайдера "Влево"
var nameBtnRight = 'Right';//текст в кнопке выбора направления слайдера "Вправо"
var hintBtnLeft = 'Previous slide';//подсказка на кнопке выбора направления слайдера "Влево"
var hintBtnRight = 'Next slide';//подсказка на кнопке выбора направления слайдера "Вправо"
var move = 'pause';//режим слайдера (плэйера) - ключевые слова: play, pause
var start = true;//признак первого включения - нет слайда для сдвига, т.к. пользователь еще не выбрал направление
var way = 'left';//направление слайдера - ключевые слова: left, right
var old_startIndx = sliders_workStartIndx;//предыдущие данные - индекс первого отображаемого слайда
var sliders_workStartIndx = 0;//индекс первого отображаемого слайда
var old_way = way;
var slideWidth_Px = '0px';//размер слайда в пикселях
/*END Блок <Внутренние>*/
/*END Блок <Объявления и начальная инициализация Глобальных переменных>*/

/**
 * вызов сразу после загрузки всего HTML-я:
 * первоначальная инициализация переменных, пересчет изменяемых переменных
 * работаем напрямую с глобальными переменными, DOM
 */
function onLoadSlider() {
	//инициируем из input[type=hidden] - получены из конструктора слайдера
	Slider_slideCountVisual	= parseInt(O('Slider_slideCountVisual').value);
	Slider_slideCount	= parseInt(O('Slider_slideCount').value);
	Slider_Manual		= parseInt(O('Slider_Manual').value);
	Slider_TimeWait		= parseInt(O('Slider_TimeWait').value) * 1000;
	Slider_Time		= parseInt(O('Slider_Time').value) * 1000;
	Slider_OnlyOne		= parseInt(O('Slider_OnlyOne').value);
	animationTimingFunction	= O('animationTimingFunction').value;
	Slider_nameWrapper	= O('Slider_nameWrapper').value;
	Slider_classSlide	= O('Slider_classSlide').value;
	Slider_nameTool		= O('Slider_nameTool').value;
	zindexVis		= parseInt(O('zindexVis').value);
	zindexUnVis		= parseInt(O('zindexUnVis').value);
	nameBtnLeft		= O('nameBtnLeft').value;
	nameBtnRight 		= O('nameBtnRight').value;
	hintBtnLeft		= O('hintBtnLeft').value;;
	hintBtnRight		= O('hintBtnRight').value;;
	move			= O('move').value;;
	start			= (/true/i).test(O('start').value);
	way			= O('way').value;;
	old_startIndx		= parseInt(O('old_startIndx').value);
	sliders_workStartIndx	= parseInt(O('sliders_workStartIndx').value);
	old_way			= way;

	//обнуляем длину глобальных массивов
	Slider_slideUser.length = 0;//массив слайдов от пользователя, введённых в div слайдера вручную
	slidersDIV.length = 0;//массив слайдов - полный
	sliders_work.length = 0;//список отображаемых на текущий момент слайдов
	
	//инициируем в зависимости от текущей страницы
	outerCSSLinks = document.styleSheets.length;//число styleSheet до включения слайдера
	initArr_Slider_slideUser();//init global array Slider_slideUser
	initArr_slidersDIV();//init global array slidersDIV
	
	showSlider();//визуализация начального положения слайдера

	//оформляем кнопки управления, если есть указание
	if (Slider_Manual == 1) {
		showSliderTool();
	}

	/*//BEGIN секция "отладка"
	var s = 'function onLoadSlider()\n';
	s += 'Slider_Files = ' + Slider_Files.join() + '\n';
	s += 'Slider_slideUser = ' + Slider_slideUser.join() + '\n';
	s += 'slidersDIV = ' + slidersDIV.join() + '\n';
	alert(s);
	//END секция "отладка"*/
}

/**
 * инициируем глобальный массив Slider_slideUser
 * 
 * Внимание!! при пользовательском вводе может быть полный бред.
 * Поэтому сохраняем только элементы [class=Slider_classSlide]. Всё остальное удаляем
 * Работаем напрямую с DOM
 * Вызов: function onLoadSlider()
 */
function initArr_Slider_slideUser() {
	var wr = O(Slider_nameWrapper);
	if (wr.childNodes.length > 0) {
		var j = 0;
		for (var i = 0; i < wr.childNodes.length; i++) {
			if (wr.childNodes[i].outerHTML !== undefined) {
				if (wr.childNodes[i].className == Slider_classSlide) {
					Slider_slideUser[j] = wr.childNodes[i];
					j++;
				}
			}
		}
	}
	clearWrapper();//чистим div-wrapper слайдера от пользовательского мусора
}

/**
 * чистим DOM Slider_nameWrapper от любых childNode
 * вызов - из function initArr_Slider_slideUser()
 * Внимание!! Firefox. В веб-консоли создаётся иллюзия, что при смене направления или смене числа отображаемых слайдов - генерируется новая styleSheet = чего на самом деле нет.
 * Удостовериться (что это только глюк firefox) можно:
 * (1) раскоментив секцию "отладка" - видно, что не меняется общее число styleSheets, а также, видно, что innerHTML перезаписывается новыми данными).
 * (2) перейдя в консоль Chrome/Opera.
 * Работаем напрямую с DOM
 */
function clearWrapper() {
	wrapper = O(Slider_nameWrapper);//wrapper слайдера
	while (wrapper.lastChild)
	{
		wrapper.removeChild(wrapper.lastChild);
	}

	/*//BEGIN секция "отладка"
	var s = 'function clearWrapper()\n';
	s += 'outerCSSLinks = ' + outerCSSLinks + '\n';
	s += 'document.styleSheets.length = ' + document.styleSheets.length + '\n';
	if (document.styleSheets[outerCSSLinks])
		s += 'innerHTML = ' + wSheet.innerHTML + '\n';
	alert(s);
	//END секция "отладка"*/
}

/**
 * Для сокращения текста реализуем механизм document.getElementById(idName)
 * 
 * @param {string} idName id элемента
 * return {Element} Element с id=idName
 */
function O(idName) {
	return document.getElementById(idName);
}

/**
 * инициируем глобальный массив slidersDIV
 * Вызов: function onLoadSlider()
 */
function initArr_slidersDIV() {
	var s = 'function initArr_slidersDIV()\n';
	var wrapper = O(Slider_nameWrapper);//прямой линк на узел слайдера
	/*Внимание! width видимого слайда в %. Пришлось вынести на уровень выше (в вызывающую ф-цию), т.к. почему-то расчёт в function createSlide() давал разные результаты для разных i, заметным на глаз становился результат при i>3???*/
	var wdth = slideWidth();
	slideWidth_Px = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100).toFixed(2) + 'px';//в px

	//создаём список слайдов slidersDIV
	for (var i = 0; i < Slider_slideCount; i++)
	{
		//добавляем элемент в конец стека
//		slidersDIV.push(createSlide(wrapper, i, wdth, 1));
		slidersDIV.push(createSlide(wrapper, i, slideWidth_Px, 1));
		var slide = slidersDIV[slidersDIV.length-1];
		s += '\n['+i+'] ID: "' + slide.id + '"\n';//отладочная инфа
	}
//	alert(s);//отладочная инфа
}

/**
 * формируем значение width отдельного слайда, в %. Прежде всего для единообразия алгоритма рассчета
 * 
 * return {string} [число%]
 * Вызов: function initArr_slidersDIV() и startMove(), куда и возвращаем данные
 */
function slideWidth()
{
	var s = 'function slideWidth()\n';//отладка

	var wrapper = O(Slider_nameWrapper);//прямой линк на узел слайдера
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//без учета padding
	var wdth = (100 * (parseFloat(getComputedStyle(wrapper).width) - parseFloat(getComputedStyle(wrapper).paddingLeft) - parseFloat(getComputedStyle(wrapper).paddingRight)) / (Slider_slideCountVisual * parseFloat(getComputedStyle(wrapper).width))) + '%';//с учетом padding
	s += 'wdth = "' + wdth + '"\n';
	s += 'width = "' + (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100) + 'px' + '"\n';
	s += 'wrapper.width = "' + getComputedStyle(wrapper).width + '"\n';
	s += 'wrapper.paddingLeft = "' + getComputedStyle(wrapper).paddingLeft + '"\n';
	s += 'wrapper.paddingRight = "' + getComputedStyle(wrapper).paddingRight + '"\n';
	
//	alert(s);
	return wdth;
}


/**
 * формируем отдельный слайд вплоть до его визуализации/привязки к node wrapper
 * 
 * @param {HTMLElement} wrapper обертки слайдера
 * @param {integer} i DIV текущий визуализуруемый слайд
 * @param {string} sWidth width слайда, [число+единица измерения/%|px/]
 * @param {integer} standart признак слайда, [default=1], 1 - видимый слайд, else - проявляющийся
 * return {HTMLElement}
 * Вызов: function initArr_slidersDIV(), куда и возвращаем линк на созданный slide
 */
function createSlide(wrapper, i, sWidth, standart) {
	//формируем div - отдельный слайд
	var slide = document.createElement('div');
	slide.className = Slider_classSlide;
	if (standart == 1) {//задаём id, согласно standart
		slide.id = 'slide_'+i;//видимый слайд
	} else {
		slide.id = 'slide_'+i+'_copy';//слайд-копия уже существующего (проявляющийся слайд)
	}
	if (i < Slider_Files.length) {//фоновая картинка слайда, если есть
		slide.style.backgroundImage = "url('" + Slider_Files[i] + "')";
	}
	//width переводим из % в px
//	slide.style.width = ((parseFloat(getComputedStyle(wrapper).width) * parseFloat(sWidth) / 100).toFixed(2) - Slider_slideCountVisual) + 'px';
//	slide.style.width = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(sWidth) / 100) + 'px';
	slide.style.width = sWidth;//оставляем проценты
	slide.style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height)) - i*2) + 'px';
	//фильтруем верхний=видимый=бОльший/нижний=невиждимый=мЕньший слайды
	if (i < Slider_slideCountVisual) {
	//видимый
		slide.style.zIndex = zindexVis;
	} else {//невидимый
		slide.style.zIndex = zindexUnVis;
	}
	//интегрируем то что ввел пользователь
	if (i < Slider_slideUser.length) {
		slide.innerHTML = Slider_slideUser[i].innerHTML;
	}

	//добавляем обработчик события - клик
	slide.addEventListener("click", function() {sliderTool_click(this.id);}, true);

	return slide;
}

/**
 * визуализируем начальное (невключенное) состояние слайдера в момент только после создания
 * 
 * вызов - из function onLoadSlider()
 */
function showSlider() {
	var wrapper = O(Slider_nameWrapper);
	var s = '';
	
	for (var i = 0; i < slidersDIV.length; i++) {
		s = 'function showSlider()<br>\n';
		if (i < Slider_slideCountVisual) {
			var slide = slidersDIV[i];
			wrapper.appendChild(slide);

			slide.style.left = (i * (parseFloat(getComputedStyle(slide).width))) + 'px';
//			slide.style.left = '0px';

		/*//BEGIN секция "отладка"*/
//		s += '\n['+i+'] ID: "' + slide.id + '"<br>\n';
//		s += 'left: "' + slide.style.left + '" ? "' + getComputedStyle(slide).left + '"<br>\n';
//		s += 'z-index: "' + slide.style.zIndex + '" ? "' + getComputedStyle(slide).zIndex + '"<br>\n';
//		s += 'width: "' + slide.style.width + '" ? "' + getComputedStyle(slide).width + '"<br>\n';
//		s += 'height: "' + slide.style.height + '" ? "' + getComputedStyle(slide).height + '"<br>\n';
//		slide.innerHTML += s;//выводим отладочную инфу
		//END секция "отладка"*/
		}
	}
}

/**
 * визуализируем элементы управления слайдера
 * 
 * вызов - из function onLoadSlider()
 * здесь!! - добавить точки-кнопки (по числу слайдов) для малого числа слайдов (меньше 10)
 * ЗДЕСЬ!!! Глюк. При динамическом изменении размера div слайдера, размеры слайдов остаются старыми до точки пересчета. То ли (1) переходить в рассчетах на %, с текущих px. То ли (2) городить отдельную функцию отследивания размеров окна.
 */
function showSliderTool() {
	var wrapper = O(Slider_nameWrapper);

	//BEGIN создаём/визуализируем ручки ручного управления
	var tool = document.createElement('div');//элемент div
	tool.className = Slider_nameTool;//задаём его css-класс
	tool.id = Slider_nameTool;//задаём его id

	var arroy = document.createElement('div');//элемент div
	arroy.className = 'slider_toolArroyL';//задаём его css-класс
	arroy.innerHTML = nameBtnLeft;//выводим текст в кнопке
	arroy.title = hintBtnLeft;
	/*добавляем обработчик события - клик*/
	arroy.addEventListener("click", function() { sliderTool_click('left'); }, false);
	tool.appendChild(arroy);//добавляем стрелку "Влево" к общему DIV-у элементов управления слайдера

	var arroy = document.createElement('div');//элемент div
	arroy.className = 'slider_toolArroyR';//задаём его css-класс
	arroy.innerHTML = nameBtnRight;//выводим текст в кнопке
	arroy.title = hintBtnRight;
	/*добавляем обработчик события - клик*/
	arroy.addEventListener("click", function() { sliderTool_click('right'); }, false);
	tool.appendChild(arroy);//добавляем стрелку "Вправо" к общему DIV-у элементов управления слайдера

	wrapper.appendChild(tool);//визуализируем: отрисовываем весь узел tool

	//BEGIN рассчет margin-top здесь!
	if (parseFloat(getComputedStyle(tool).marginTop) == 0) {
		//height wrapper-а для слайдера из CSS
		var heightWrapperSlider = getComputedStyle(wrapper).height;//[цифра+px]
		//height кнопки управления "Влево"/"Вправо" из CSS
		var heightToolArrow = getComputedStyle(tool).height;//[цифра+px]
		//число "линий" слайдера, включая невидимые
		if (move == "play") {//при включенном слайдере реально отображается на 1 слайд больше
			var lines = Slider_slideCountVisual + 1;
		} else {
			if (start) {
				var lines = Slider_slideCountVisual;
			} else {
				var lines = Slider_slideCountVisual + 1;
			}
		}
		//преобразуем абстрактные "линии" в px = рассчет margin-top элементов управления
		var tmp = parseInt(heightWrapperSlider) * (lines-1) + parseFloat(parseInt(heightWrapperSlider) / 2 + parseFloat(parseInt(heightToolArrow) / 2));
		tool.style.marginTop = - tmp + 'px';
	}
	//END рассчет margin-top
	//END создаём/визуализируем ручки ручного управления
	
	/*//BEGIN секция "отладка"
	var s = 'function showSliderTool()\n';
	s += 'Margin-Top = ' + tool.style.marginTop
		+ '\nheightWrapperSlider = ' + heightWrapperSlider
		+ '\nheightToolArrow = ' + heightToolArrow
		+ '\nlines = ' + lines
		+ '\nSlider_slideCountVisual = ' + Slider_slideCountVisual;
//	alert(s);
	//END секция "отладка"*/
}

/**
 * обработчик события: клик пользователем по элементам слайдера: любой слайд, кнопки "влево" и "вправо"
 * Переопределяем настройки движения: переопределяем направление (way: 'left' или 'right'), режим (move: 'pause' или 'play') движения; сохраняем предыдущие значения (old_way, old_startIndx, old_sliders_work)
 * При появлении режима move=='play', даём команду на начало проигрывания слайдов: function startMove()
 * 
 * @param {string} direct новое направление движения: "left" - кнопка "Влево"; "right" - кнопка "Вправо"; "slide_X" - слайд с номером X, совпадает с id слайда, Х - совпадает с №пп в массиве slidersDIV
 * 
 */
function sliderTool_click(direct) {
	var s = 'function sliderTool_click()\n';//отладка
	s	+= 'User press (direct) = ' + direct
		+ '\nold way = ' + way
		+ '\nold move = ' + move;//отладка
	
	//режим направления движения: меняем направление при нажатии кнопок "Вправо"-"Влево"
	if ((direct == "left")||(direct == "right")) {
		old_way = way;
		way = direct;
	}

	var s1 = '';
	var date = new Date();
	s1	+= 'date = ' + date.toLocaleString()
		+ '<br>start = ' + start
		+ '<br>old_startIndx = ' + old_startIndx
		+ '<br>startIndx = ' + sliders_workStartIndx
		+ '<br>way = ' + way
		+ '<br>old_way = ' + old_way
		+ '<br>move = ' + move;//отладка

	//для режима "работа-пауза" организуем режим тригера при любом клике
	if (move == "pause") {
		move = "play";

		/*BEGIN предыдущие данные - сохраняем*/
		if (start) {
			old_startIndx = sliders_workStartIndx;
			old_sliders_work = sliders_work.slice(0);
		} else {
			//Дополнительная коррекция. Глюк при последовательном нажатии кнопок L-R
			initIndxs();
		}
		/*END предыдущие данные - сохраняем*/
	} else {
		move = "pause";
		
		//Дополнительная коррекция. Глюк при последовательном нажатии кнопок L-R
		initIndxs();
		
		//при включении паузы = резко ускоряем движение
		wSheet.innerHTML = '';
		for(var i = 0; i < sliders_work.length; i++) {
			sliders_work[i].style.animationName = '';//имя анимации
			sliders_work[i].style.animationDuration = 3 + 'ms';//время анимации, сек
			sliders_work[i].style.animationDelay = 3 + 'ms';//время задержки перед включением анимации, мсек
			sliders_work[i].style.animationIterationCount = 0;//число проигрываний анимации
		}
	}
	
	s1	+=  '<br>old_startIndx (New) = ' + old_startIndx//;
		+ '<br>startIndx (New) = ' + sliders_workStartIndx;
//	document.getElementById('statusBar').innerHTML = s1;//отладка
	
	s	+= '\nold_startIndx = ' + old_startIndx
		+ '\nnew way = ' + way
		+ '\nnew move = ' + move;//отладка;
//	alert(s);//отладка

	if (move != "pause")//включаем движение
	{
		startMove();
	}
}

/**
 * выполнить при старте цикла движения: как при обычном старте, так и при смене слайдов: переопределяем переменные для выполнения движения:
 * 1) стартовый индекс: sliders_workStartIndx
 * 2) массив текущих показываемых слайдов: sliders_work в порядке показа слайдов в зависимости от выбранного режима: left = первый слайд - который уходит с экрана, последний слайд - который вползает на экран; right = первый слайд, который входит на экран, последний - который уходит. "Первый" - крайнее левое положение, "последний" - крайнее правое положение
 * 3) 
 * вызов - из function sliderTool_click() и function nextSlide()
 * даём команду по таймауту на перерасчет следующего рабочего кадра: function nextSlide() при Slider_OnlyOne != 1, иначе - запускаем по таймауту function notSlide()
 * 
 */
function startMove() {
	//BEGIN формируем массив sliders_work
	var s = 'function startMove()\n';//отладка
	s	+= 'start = ' + start
		+ '\nstartIndx = ' + sliders_workStartIndx
		+ '\nway = ' + way
		+ '\nmove = ' + move
		+ '\n';//отладка
	
	var s1 = '';
	s1	+= 'start = ' + start
		+ '<br>old_startIndx = ' + old_startIndx
		+ '<br>startIndx = ' + sliders_workStartIndx
		+ '<br>way = ' + way
		+ '<br>old_way = ' + old_way
		+ '<br>move = ' + move;//отладка
//	document.getElementById('statusBar').innerHTML += '<hr>'+s1;//отладка
	
	var wrapper = O(Slider_nameWrapper);
	if (((way == "right")&&(move == "play"))||((old_way == "right")&&(move == "pause"))) {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		if (!start) {//первый старт - не требуется сдвигать слайд
			sliders_workStartIndx = old_startIndx - 1;
			if (sliders_workStartIndx < 0) {
				sliders_workStartIndx = slidersDIV.length-1;
			}
		} else {
			start = false;
		}
		
		//переопределяем sliders_work
		sliders_work.length = 0;
		for (var i = 0; i < Slider_slideCountVisual; i++) {
			k = sliders_workStartIndx + i;
//			s += '; k='+k;
			if (k > slidersDIV.length-1)
				k = k - slidersDIV.length;
//			s += '=>'+k;
//			s += '; '+slidersDIV[k].id+'\n';
			sliders_work.push(createSlide(wrapper, k, 1));
		}
		//дополнительный элемент: нулевой позицией в sliders_work, изначально k = sliders_workStartIndx + i + 1;
		k = sliders_workStartIndx-1;
		s += '; [kMIN]='+k;
		if (k < 0)
			k = slidersDIV.length - 1;
		s += '=>' + k;
		s += '; ' + slidersDIV[k].id + '\n';
		sliders_work.unshift(slidersDIV[k]);
	}
	if (((way == "left")&&(move == "play"))||((old_way == "left")&&(move == "pause"))) {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		if (!start) {//первый старт - не требуется сдвигать слайд
			sliders_workStartIndx = old_startIndx + 1;
			if (sliders_workStartIndx > slidersDIV.length-1)
				sliders_workStartIndx = 0;
		} else {
			start = false;
		}
		
		//переопределяем sliders_work
		sliders_work.length = 0;
		for (var i = 0; i < Slider_slideCountVisual; i++) {
			k = sliders_workStartIndx + i;
//			s += '; k='+k;
			if (k > slidersDIV.length-1)
				k = k - slidersDIV.length;
//			s += '=>'+k;
//			s += '; '+slidersDIV[k].id+'\n';
			sliders_work.push(createSlide(wrapper, k, 1));
		}
		//дополнительный элемент: last позицией в sliders_work, изначально k = sliders_workStartIndx + i + 1;
		k = k + 1;
//		s += '; [kMAX]='+k;
		if (k > slidersDIV.length-1)
			k = k - slidersDIV.length;
//		s += '=>'+k;
//		s += '; '+slidersDIV[k].id+'\n';
		sliders_work.push(slidersDIV[k]);
	}
	//END формируем массив sliders_work

	//BEGIN визуализируем начальный кадр слайдера
	clearWrapper();//скрываем предыдущие итерации
	
	//визуализируем текущее стартовое состояние слайдера
	//width одного слайда
	var wdth = slideWidth();
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//в %
	var wdth_px = slideWidth_Px;//в px
//	var wdth_px = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100).toFixed(2) + 'px';//в px
	var keyfr = '';//паралельно - формируем css-строку для будущей анимации (добавка в DOM CSS)
	var s5 = 'function startMove()\n';//отладка
	for (var i = 0; i < sliders_work.length; i++) {
		//устанавливаем width (слетает почему-то...)
//		sliders_work[i].style.width = wdth;
		s5 += '\n[' + i + '] width = "' + sliders_work[i].style.width + '"; "' + wdth_px + '"\n';
		sliders_work[i].style.width = wdth_px;
		//устанавливаем top (в каждой новой коллекции показываемых слайдов (sliders_work) - переопределяется top каждого слайда в зависимости от текущей позиции [i] в коллекции sliders_work)
		sliders_work[i].style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height)) - i*2) + 'px';
//		sliders_work[i].style.top = '0px';

		//почему-то не пашет напрямую sliders_work[i].style.animation - нет присвоения animationName
		//standart; Moz=Firefox, Webkit=Crome, Opera, Safari, O=Opera
		sliders_work[i].style.animationName = 'move_' + i;//имя анимации
		sliders_work[i].style.animationDuration = Slider_Time + 'ms';//время анимации, сек
		sliders_work[i].style.animationTimingFunction = animationTimingFunction;//временная функция анимации
		sliders_work[i].style.animationDelay = Slider_TimeWait + 'ms';//время задержки перед включением анимации, мсек
		sliders_work[i].style.animationIterationCount = 1;//число проигрываний анимации
		sliders_work[i].style.animationFillMode = 'forwards';//состояние объекта после анимации - Not support Safari
		
		//устанавливаем left (в каждой новой коллекции показываемых слайдов (sliders_work) - переопределяется top каждого слайда в зависимости от текущей позиции [i] в коллекции sliders_work)
		if (way == "right") {//дополнительный элемент: нулевой позицией в sliders_work
			sliders_work[i].style.left = (i * (parseFloat(wdth_px)) - parseFloat(wdth_px)).toFixed(2) + 'px';
//			sliders_work[i].style.left = '0px';;
			
			//формируем список анимаций
			keyfr += '@keyframes move_' + i + ' {\n';//имя анимации [move_id]
			keyfr += '0%   { left: ' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + 'px; }\n';//текущее значение left
			keyfr += '100% { left: ' + (parseFloat(sliders_work[i].style.left) + parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//новое значение left;
			s5 += 'left = "' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + '" => "' + (parseFloat(sliders_work[i].style.left) + parseFloat(wdth_px)).toFixed(2) + '"\n';
		}
		if (way == "left") {//дополнительный элемент: last позицией в sliders_work
			sliders_work[i].style.left = (i * (parseFloat(wdth_px))).toFixed(2) + 'px';

			//формируем список анимаций
			keyfr += '@keyframes move_' + i + ' {\n';//имя анимации [id_move]
			keyfr += '0%   { left: ' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + 'px; }\n';//текущее значение left
			keyfr += '100% { left: ' + (parseFloat(sliders_work[i].style.left) - parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//новое значение left;
			s5 += 'left = "' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + '" => "' + (parseFloat(sliders_work[i].style.left) - parseFloat(wdth_px)).toFixed(2) + '"\n';
		}

		var s1 = '';//отладка
		s1 += '['+i+'] = '+sliders_work[i].id+'<br>';
		s1 += 'Top: "' + sliders_work[i].style.top + '" ? "' + getComputedStyle(sliders_work[i]).top + '"<br>';
		s1 += 'Left: "' + sliders_work[i].style.left + '" ? "' + getComputedStyle(sliders_work[i]).left + '"<br>';
		s1 += 'z-index: "' + sliders_work[i].style.zIndex + '" ? "' + getComputedStyle(sliders_work[i]).zIndex + '"<br>';
		s1 += 'width: "' + sliders_work[i].style.width + '" ? "' + getComputedStyle(sliders_work[i]).width + '"<br>';
		s1 += 'height: "' + sliders_work[i].style.height + '" ? "' + getComputedStyle(sliders_work[i]).height + '"<br>';
		if ((way == "right")&&(i == 0)) {
		//дополнительный элемент: нулевой позицией в sliders_work
//			sliders_work[i].style.left = '-' + wdth_px;
			s1 += 'additional<br>';
		}
		if ((way == "left")&&(i == sliders_work.length-1)) {
		//дополнительный элемент: last позицией в sliders_work
//			sliders_work[i].style.left = i * parseFloat(getComputedStyle(sliders_work[i-1]).width) + 'px';
//			sliders_work[i].style.top = '-' + getComputedStyle(sliders_work[i-1]).height;
			s1 += 'additional<br>';
		}
//		sliders_work[i].innerHTML = s1;//отладка

		wrapper.appendChild(sliders_work[i]);//добавляем готовый слайд в DOM-показываемого пользователю документа 

		s += '\n';//отладка
		s += '[' + i + '] = "' + sliders_work[i].id + '"\n';//отладка
		s += 'Top: "' + sliders_work[i].style.top + '" ? "' + getComputedStyle(sliders_work[i]).top + '"\n';
		s += 'Left: "' + sliders_work[i].style.left + '" ? "' + getComputedStyle(sliders_work[i]).left + '"\n';
		s += 'z-index: "' + sliders_work[i].style.zIndex + '" ? "' + getComputedStyle(sliders_work[i]).zIndex + '"\n';
		s += 'width: "' + sliders_work[i].style.width + '" ? "' + getComputedStyle(sliders_work[i]).width + '"\n';
		s += 'height: "' + sliders_work[i].style.height + '" ? "' + getComputedStyle(sliders_work[i]).height + '"\n';
	}
//	alert(s5);
	
	//визуализируем кнопки управления, если есть указание
	if (Slider_Manual == 1) {
		showSliderTool(wrapper);
	}

//	alert(s);//отладка
//	alert(s + '\n' + keyfr);//отладка
	//END визуализируем начальный кадр слайдера
	
	//запускаем "движение"
	if (move == "play") {
//		css_edit(keyfr);//создаём новый тег style и добавляем в него keyfr
		wSheet = css_edit(keyfr);//создаём новый тег style и добавляем в него keyfr
		if (Slider_OnlyOne != 1) {
			setTimeout(nextSlide, Slider_TimeWait+Slider_Time);//выполняем по завершению анимации
		} else {
			setTimeout(notSlide, Slider_TimeWait+Slider_Time);//выполняем по завершению анимации
		}
	}
}

/**
 * Добавляем новый тег style в head документа, куда и записываем styles
 * 
 * вызов - из function startMove()
 * возвращаем управление в function startMove()
 * @param {string} styles текстовая строка добавляемых css-правил
 * @return {document.styleSheet} ссылка на styleSheet (текущего документа), с которым работаем
 */
function css_edit(styles) {
	var s = 'function css_edit()\n';//отладка

	//чтобы не плодить новые styleSheet в рамках одного документа
	styleElt = wSheet;
	if (styleElt === null) {
		s += 'styleElt === null\n';
		var styleElt = document.createElement("style");//новый node style
		document.head.appendChild(styleElt);
		ss = document.styleSheets[document.styleSheets.length-1];
	}
	
	//добавляем styles
	if (styleElt.innerHTML != styles) {
	//меняем innerHTML, если он не совпадает с новым - иначе плодятся styleSheets
		styleElt.innerHTML = styles;
	} else {//иначе движется только один первый раз
		styleElt.disabled = true;
		styleElt.disabled = false;
	}
	
	s += 'document.styleSheets.length = ' + document.styleSheets.length + '\n';
	s += 'styles = [\n' + styles + ']\n';
//	alert(s);//отладка
	
	return styleElt;//отдаём на уровень выше ссылку на node рабочей styleSheet
}

/**
 * при move == "play", при завершении анимации прокрутки кадра - делаем подготовку к следующему
 * 
 * вызов - по таймауту из function startMove()
 * передаём управление в function startMove()
 */
function notSlide() {
	var s = 'function notSlide()\n\n';
	old_way = way;//
	move = "pause";
	
	//переопределяем old_startIndx, sliders_workStartIndx
	old_startIndx = sliders_workStartIndx;
	if (way == "right") {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		sliders_workStartIndx = old_startIndx - 1;
		if (sliders_workStartIndx < 0) {
			sliders_workStartIndx = slidersDIV.length-1;
		}
	}
	if (way == "left") {
		sliders_workStartIndx = old_startIndx + 1;
		if (sliders_workStartIndx > slidersDIV.length-1) {
			sliders_workStartIndx = 0;
		}
	}
}

/**
 * при move == "play", при завершении анимации прокрутки кадра - делаем подготовку к следующему
 * 
 * вызов - по таймауту из function startMove()
 * передаём управление в function startMove()
 */
function nextSlide() {
	var s = 'function nextSlide()\n\n';
	old_way = way;//

	//переопределяем old_startIndx, sliders_workStartIndx
	old_startIndx = sliders_workStartIndx;
	//Внимание!!! почему-то для Right не требуется дополнительно корректировать sliders_workStartIndx???
	if (way == "right") {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		sliders_workStartIndx = old_startIndx - 1;
		if (sliders_workStartIndx < 0) {
			sliders_workStartIndx = slidersDIV.length-1;
		}
	}
	if (way == "left") {
		sliders_workStartIndx = old_startIndx + 1;
		if (sliders_workStartIndx > slidersDIV.length-1) {
			sliders_workStartIndx = 0;
		}
	}

	startMove();//новый слайд
}

/**
 * переопределяем sliders_workStartIndx и old_startIndx при клацанье кнопками left-right
 * 
 * запускать только после переопределения переменных old_way и way
 * вызов - из function sliderTool_click()
 */
function initIndxs() {
	var s = '';
	if (move == "pause") {
		if ((old_way == "right")&&(way == "left")) {
//			alert('pause R->L');
			var tmp = sliders_work[1].id.split('_');
			sliders_workStartIndx = parseInt(tmp[1]) -2;
			old_startIndx = sliders_workStartIndx - 1;
		}
		if ((old_way == "left")&&(way == "right")) {
//			alert('pause L->R');
			var tmp = sliders_work[1].id.split('_');
			sliders_workStartIndx = parseInt(tmp[1]) +1;
			old_startIndx = sliders_workStartIndx + 1;
		}
	} else {
		if (!start) {
			if ((old_way == "right")&&(way == "left")) {
//				alert('play R->L');
				if (Slider_OnlyOne != 1) {
					var tmp = sliders_work[1].id.split('_');
					sliders_workStartIndx = parseInt(tmp[1]);
					old_startIndx = sliders_workStartIndx - 1;
				} else {
					var tmp = sliders_work[1].id.split('_');
					sliders_workStartIndx = parseInt(tmp[1]) - 1;
					old_startIndx = sliders_workStartIndx - 1;
				}
			}
			if ((old_way == "left")&&(way == "right")){
//				alert('play L->R');
				if (Slider_OnlyOne != 1) {
					var tmp = sliders_work[1].id.split('_');
					sliders_workStartIndx = parseInt(tmp[1]) - 1;
					old_startIndx = sliders_workStartIndx + 1;
				} else {
					var tmp = sliders_work[1].id.split('_');
					sliders_workStartIndx = parseInt(tmp[1]);
					old_startIndx = sliders_workStartIndx + 1;
				}
			}
		}
	}
	
	//BEGIN Дополнительная коррекция
	if (old_startIndx < 0) {
		old_startIndx = slidersDIV.length - 1 + old_startIndx + 1;
	}
	if (old_startIndx > slidersDIV.length-1) {
		old_startIndx = 0 + old_startIndx - 1;
	}
	if (sliders_workStartIndx < 0) {
		sliders_workStartIndx = slidersDIV.length - 1 + sliders_workStartIndx + 1;
	}
	if (sliders_workStartIndx > slidersDIV.length-1) {
		sliders_workStartIndx = 0 + sliders_workStartIndx - 1;
	}
	//END Дополнительная коррекция
}