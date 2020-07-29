/**
 * Slider Version 4.02.2019.09.19 (c) Shemigon Igor
 * 
 * Описание возможностей : 
 * 1. Требования к элементам CSS (особенности CSS) для конкретного слайдера:
 * 1.1 контейнер слайдера <div id="slider_XX">, где XX-номер слайдера по порядку, начиная с нуля:
 *	для изменения id см.[html] <input type="hidden" id="slider_0_id" value="slider_0">
 *	остальные приведенные параметры являются обязательными только без использования subwrapper (см.п.1.2):
 * 	box-sizing: border-box;	текущая алгоритмика js-зашита именно на поведение элемента "border-box"
 * 	display: block;
 *	overflow: hidden|none;	значение "none" возможно только при применении subwrapper (см.п.1.2)
 * 	height: YY1;	должно быть равно height слайда (см.п.1.3)
 *	padding: 0;	допускается ненулевые padding-left и padding-right, что потребует дополнительного тестирования
 * 1.2 дополнительный контейнер слайдера <div id="subwrapper">:
 *	для изменения id см.[html] <input type="hidden" id="slider_0_subwrapper_id" value="subwrapper">
 * 	box-sizing: border-box;	текущая алгоритмика js-зашита именно на поведение элемента "border-box"
 * 	display: block;
 *	overflow: hidden;
 * 	height: YY1;	должно быть равно height слайда (см.п.1.3)
 *	width: 100%;
 *	padding: 0;	допускается ненулевые padding-left и padding-right, что потребует дополнительного тестирования
 * 1.3 отдельный слайд <div class="slide">
 *	для изменения класса см.[html] <input type="hidden" id="slider_0_slide_class" value="slide">
 * 	position: relative;
 *	width - задаётся из js-скрипта
 * 	height: YY1;	должно быть равно height слайдера (см.п.1.1), либо height subwrapper (см.п.1.2) при его использовании
 * 	display: block; текущая алгоритмика js-зашита именно на поведение элемента "block"
 * 	box-sizing: border-box;	текущая алгоритмика js-зашита именно на поведение элемента "border-box"
 *	z-index - задаётся из js-скрипта (см.[html] <input type="hidden" id="slider_0_slide_zindex_Vis" value="25"> и <input type="hidden" id="slider_0_slide_zindex_Unvis" value="5">)
 *	
 * 1.4 контейнер элементов управления слайдером <div id="sliderTool">
 *	для изменения id см.[html] <input type="hidden" id="slider_0_tool_id" value="sliderTool">
 * 	display: block;	текущая алгоритмика js-зашита именно на поведение элемента "block"
 * 	box-sizing: border-box;	текущая алгоритмика js-зашита именно на поведение элемента "border-box"
 *	height: YY2	должен совпадать по размеру с height кнопок "Влево" и "Вправо" (см.п.1.5)
 *	margin-top	задаётся из js-скрипта по аналогии с первоначальным позиционированием
 * 1.5 кнопки управления "Влево" и "Вправо"
 *	class: arrowL или arrowR соответственно для кнопок "Влево" и "Вправо"
 * 	display: block;	текущая алгоритмика js-зашита именно на поведение элемента "block"
 * 	box-sizing: border-box;	текущая алгоритмика js-зашита именно на поведение элемента "border-box"
 * 	position: relative;
 *	z-index: [default]=50; можно менять, с условием, что должно быть больше z-index любого [элемента] слайда
 *	float: [left или right]; соответственно для кнопок "Влево" и "Вправо"
 *	height: YY2	должен совпадать по размеру с height slider_tool (см.п.1.4)
 *	margin-top: [default]=0; возможность установки вертикального смещения относительно slider_tool, как +, так и -
 *	возможность установки своей надписи [см.[html] <input type="hidden" id="slider_0_tool_arrowL_text" value="влево"> или <input type="hidden" id="slider_0_tool_arrowR_text" value="вправо">] на кнопках
 *	возможность установки своего title [см.[html] <input type="hidden" id="slider_0_tool_arrowL_title" value="предыдущий"> или <input type="hidden" id="slider_0_tool_arrowR_title" value="следующий">] на кнопках
 * 
 * 2. Особенности и возможности:
 * 2.1 Движение каждого слайдера организовано индивидуально посредством генерации средствами js под каждый слайдер отдельной styleSheet (добавление еще одного тега <style> в секцию <head>). Каждый слайд движется индивидуально средствами CSS (@keyframes).
 * 2.2 Скрипт поддерживает такие органы пользовательского управления: кнопки "Вправо" и "Влево". Их наличие задаётся в [html] <input type="hidden" id="slider_0_tool_manualLR" value="2">, где "1" - будут кнопки, любое другое (больше 1, целое) - они не будут отображаться
 * 2.3 Поддерживаются такие режимы движения: "движение бесконечно вправо до клика", "движение бесконечно влево до клика", "пауза", "движение вправо на 1 слайд и пауза", "движение влево на 1 слайд и пауза"
 * 
 * 3. Переменные, управляющие поведением слайдера:
 * 3.1 Общие для всего документа переменные.
 * 3.1.1 Задаются <input type="hidden" id="sliders_var" value="value">, где
 *	var	- название переменной
 *	value	- значение переменной
 * 3.1.2 Список переменных:
 * "sliders_Count"	- число слайдеров на странице
 * 3.2 Переменные, задаваемые для каждого слайдера
 * Задаются <input type="hidden" id="slider_XX_var" value="value">, где
 *	XX	- номер слайдера в текущем документе, счет начинается с нуля
 *	var	- название переменной
 *	value	- значение переменной
 * 3.2.2 Список переменных:
 * "slider_XX_id"	- id div-оболочки слайдера
 * "slider_XX_subwrapper_id"	- id div-оболочки слайдера, дополнителнительной [необязательный]
 * "slider_XX_slide_class"	- class для кадого отдельного слайда в данном слайдере, общий для всех слайдов в этом слайдере
 * "slider_XX_tool_id"	- id div-оболочки элементов управления
 * "slider_XX_tool_arrowL_text"	- текст в кнопке выбора направления слайдера "Влево"
 * "slider_XX_tool_arrowR_text"	- текст в кнопке выбора направления слайдера "Вправо"
 * "slider_XX_tool_arrowL_title"	- всплывающая подсказка на кнопке выбора направления слайдера "Влево"
 * "slider_XX_tool_arrowR_title"	- всплывающая подсказка на кнопке выбора направления слайдера "Вправо"
 * "slider_XX_tool_manualLR"	- Наличие кнопок управления "Влево"-"Вправо": [1] - есть; прочее [не равное 0] - нет
 * "slider_XX_countVisual"	- целое единовременно видимое число слайдов на экране
 * "slider_XX_count"	- общее число слайдов в слайдере
 * "slider_XX_timeWait"	- Задержка между циклами, милисек, 1000мсек = 1сек
 * "slider_XX_timeAnimation"	- Время анимации, милисек, 1000мсек = 1сек
 * "slider_XX_onlyOne"	- Проигрывать шоу только 1 раз, [1] - Да; прочее [не равное 0] - нет
 * "slider_XX_animationTimingFunction"	- временная функция пролистывания кадров animation-timing-function (CSS)
 * "slider_XX_move"	- стартовый режим слайдера - ключевые слова: play, pause
 * "slider_XX_way"	- стартовое направление слайдера - ключевые слова: left, right
 * "slider_XX_startIndx"	- индекс первого слева отображаемого слайда, счет с нуля
 * "slider_XX_slide_zindex_Vis"	- z-index верхнего (видимого) слайда
 * "slider_XX_slide_zindex_Unvis"	- z-index нижнего (невидимого) слайда
 * "slider_XX_bgFiles"	- список (через запятую) фоновых картинок для слайдов [необязательный]
 * "slider_XX_"	- 
 * 
 * 4. Необходимо реализовать:
 * 4.1 Панель выбора отдельного слайда, показа числа слайдов (индикатор слайдов)
 * 4.2 Пауза при движении слайдов при наведении крысы на элемент слайдера
 * 4.3 Запрет автодвижения для сенсорных экранов
 * 4.4 drug&drop
 * 4.5 
 */

/**
 * BEGIN Блок <Объявления и начальная инициализация Глобальных переменных>
 */
var errorMessage	= '';//строка сообщений об ошибках, делаем 1 большое сообщение, вместо кучи маленьких
var sliders_Count	= 0;//число слайдеров на странице, при onLoad - от пользователя, после проверок = sliders.length
var sliders	= [];	//массив слайдеров на данной странице
var slider_def	= {	//объект-прототип слайдера??
	"wrapper-ID": "wrapperSliderV4",	//id div-оболочки слайдера
	"wrapper-Width": "0px",	//width div-оболочки слайдера в px {string}
	"subwrapper-ID": "subwrapper",	//id div-оболочки слайдера, дополнителнительной - необязательной
	"slide-Class": "slide",	//class для кадого отдельного слайда в данном слайдере, общий для всех

	"tool-ID": "slider_tool",	//id div-оболочки элементов управления
	"tool-arrowL-text": "Left",	//текст в кнопке выбора направления слайдера "Влево"
	"tool-arrowR-text": "Right",	//текст в кнопке выбора направления слайдера "Вправо"
	"tool-arrowL-title": "Previous slide",	//всплывающая подсказка на кнопке выбора направления слайдера "Влево"
	"tool-arrowR-title": "Next slide",	//всплывающая подсказка на кнопке выбора направления слайдера "Вправо"
	"tool-manualLR": 1,	//Наличие кнопок управления "Влево"-"Вправо": [1] - есть; прочее [не равное 0] - нет

	"countVisual": 2,	//целое единовременно видимое число слайдов на экране
	"count": 2,	//общее число слайдов
	"timeWait": 5000,	//Задержка между циклами, милисек, 1000мсек = 1сек
	"timeAnimation": 5000,	//Время анимации, милисек, 1000мсек = 1сек
	"onlyOne": 1,	//Проигрывать шоу только 1 раз, [1] - Да; прочее [не равное 0] - нет
	"animationTimingFunction": "ease-out",	//временная функция пролистывания кадров animation-timing-function (CSS)

	"move": "pause",	//режим слайдера (плэйера) - ключевые слова: play, pause
	"way": "left",	//направление слайдера - ключевые слова: left, right
	"startIndx": 0,	//индекс первого отображаемого слайда
	"slide-zindex-Vis": 25,	//z-index верхнего (видимого) слайда
	"slide-zindex-Unvis": 5,	//z-index нижнего (невидимого) слайда

	"move-old": "pause",	//предыдущий режим слайдера (плэйера) - ключевые слова: play, pause
	"way-old": "left",	//предыдущее направление слайдера - ключевые слова: left, right
	"startIndx-old": 0,	//предыдущие данные - индекс первого отображаемого слайда
	"slide-width-px": '0px',	//размер слайда в пикселях [string]
	"start": true,	//признак первого включения - нет слайда для сдвига, т.к. пользователь еще не выбрал направление

	"sliders_bgFiles": [],	//массив ссылок на фоновые картинки слайдов: type [string]
	"sliders_user": [],	//массив слайдов от пользователя: type [object HTMLElement]
	"sliders_DIV": [],	//массив слайдов - полный: type [object HTMLDivElement]
	"sliders_work": [],	//список отображаемых на текущий момент слайдов: type [object HTMLDivElement]
	"wSheet": null,	//рабочая CSS-таблица
	};//END object <slider>
/**
 * END Блок <Объявления и начальная инициализация Глобальных переменных>
 */

//alert('JSON.stringify =\n' + JSON.stringify(slider, null, ' ') + '\n');



/**
 * Инициируем слайдер, на основании анализа введённых всех необходимых переменных
 * В случае ошибок выводим errorMessage (и соответственно чистим её).
 * 
 * @param {int} indx индекс инициируемого слайдера
 * return {object|false} объект типа slider_def (с инициированными внутренними переменными), либо false
 * вызов - из function onLoadInitSliders()
 */
function initSlider_Vars(indx) {
	var slider_id	= initVar_ID('slider_' + indx + '_id', true);//wrapper ID
	//беда. по мере визуализации слайдера может появиться полоса прокрутки (буквально после i-ого слайда). Что приводит к сбоям в работе, т.к. Gecko-движок не пересчитывает цифры после изменения, в то время как Chrome - пересчитывает. Пока не понял суть проблемы пытался решить её подъемом на более высокий уровень с локального, что поначалу срабатывало (почему-то??). Но с набором опыта выяснил, что за "срабботки" принимал то ли результаты кэширования, то ли еще какой-то подобный бред. В итоге: решил отказаться от первоначальной расстановки слайдов в пикселях (px) в пользу процентов (%).
	if (slider_id) {
		var slider_width =  getComputedStyle(O(slider_id)).width;//wrapper Width
	}
	var slider_slide_class	= initVar_str('slider_' + indx + '_slide_class', 'slide_' + indx, true);//slide class
	var slider_tool_id	= initVar_ID('slider_' + indx + '_tool_id', true);//tools ID
	var slider_subwrapper_id	= initVar_str('slider_' + indx + '_subwrapper_id', '', false);//subwrapper ID
	var tool_arrowL_text	= initVar_str('slider_' + indx + '_tool_arrowL_text', 'left', true);//text "Влево"
	var tool_arrowR_text	= initVar_str('slider_' + indx + '_tool_arrowR_text', 'right', true);//text "Вправо"
	var tool_arrowL_title	= initVar_str('slider_' + indx + '_tool_arrowL_title', 'Previous slide', true);//hint "Влево"
	var tool_arrowR_title	= initVar_str('slider_' + indx + '_tool_arrowR_title', 'Next slide', true);//hint "Вправо"
	var tool_manualLR	= initVar_Int('slider_' + indx + '_tool_manualLR', 1, true);//Y/n btn "Влево"-"Вправо"
	var countVisual	= initVar_Int('slider_' + indx + '_countVisual', 2, true);//видимое число слайдов
	var count	= initVar_Int('slider_' + indx + '_count', 2, true);//общее число слайдов
	var timeWait	= initVar_Int('slider_' + indx + '_timeWait', 5000, true);//пауза, милисек
	var timeAnimation	= initVar_Int('slider_' + indx + '_timeAnimation', 5000, true);//анимация, милисек
	var onlyOne	= initVar_Int('slider_' + indx + '_onlyOne', 1, true);//только 1 раз, [1] - Да; прочее [не равное 0] - нет
	var animationTimingFunction	= initVar_str('slider_' + indx + '_animationTimingFunction', 'ease-out', true);//временная функция CSS
	var move	= initVar_str('slider_' + indx + '_move', 'pause', true);//режим слайдера: play, pause
	var way	= initVar_str('slider_' + indx + '_way', 'left', true);//направление слайдера: left, right
	var startIndx	= initVar_Int('slider_' + indx + '_startIndx', 0, true);//индекс первого отображаемого слайда
	var slide_zindex_Vis	= initVar_Int('slider_' + indx + '_slide_zindex_Vis', 25, true);//z-index верхнего (видимого) слайда
	var slide_zindex_Unvis	= initVar_Int('slider_' + indx + '_slide_zindex_Unvis', 5, true);//z-index нижнего (невидимого) слайда
	
	//собираем данные о результатах инициализации ключевых переменных indx-ого слайдера
	var tst = slider_id && slider_slide_class && slider_tool_id && tool_arrowL_text && tool_arrowR_text && tool_arrowL_title && tool_arrowR_title && tool_manualLR && countVisual && count && timeWait && timeAnimation && onlyOne && animationTimingFunction && move && way && typeof(startIndx) == 'number' && typeof(slide_zindex_Vis) == 'number' && typeof(slide_zindex_Unvis) == 'number';
	if (tst) {

		var slider = inherit(slider_def);//создаём наследника slider_def стр.141 Флэнаган

		//BEGIN инициируем поля созданного объекта данными от пользлователя
		slider["wrapper-ID"] = slider_id;//id div-оболочки слайдера
		slider["wrapper-Width"] = slider_width;//wrapper Width
		slider["subwrapper-ID"] = slider_subwrapper_id;//subwrapper ID
		slider["slide-Class"] = slider_slide_class;//class для кадого отдельного слайда в данном слайдере, общий для всех

		slider["tool-ID"] = slider_tool_id;//id div-оболочки элементов управления
		slider["tool-arrowL-text"] = tool_arrowL_text;//текст в кнопке выбора направления слайдера "Влево"
		slider["tool-arrowR-text"] = tool_arrowR_text;//текст в кнопке выбора направления слайдера "Вправо"
		slider["tool-arrowL-title"] = tool_arrowL_title;//всплывающая подсказка на кнопке выбора направления слайдера "Влево"
		slider["tool-arrowR-title"] = tool_arrowR_title;//всплывающая подсказка на кнопке выбора направления слайдера "Вправо"
		slider["tool-manualLR"] = tool_manualLR;//Наличие кнопок управления "Влево"-"Вправо": [1] - есть; прочее [не равное 0] - нет

		slider["countVisual"] = countVisual;//целое единовременно видимое число слайдов на экране
		slider["count"] = count;//общее число слайдов
		slider["timeWait"] = timeWait;//Задержка между циклами, милисек, 1000мсек = 1сек
		slider["timeAnimation"] = timeAnimation;//Время анимации, милисек, 1000мсек = 1сек
		slider["onlyOne"] = onlyOne;//Проигрывать шоу только 1 раз, [1] - Да; прочее [не равное 0] - нет
		slider["animationTimingFunction"] = animationTimingFunction;//временная функция пролистывания кадров animation-timing-function (CSS)

		slider["move"] = move;//режим слайдера (плэйера) - ключевые слова: play, pause
		slider["way"] = way;//направление слайдера - ключевые слова: left, right
		slider["startIndx"] = startIndx;//индекс первого отображаемого слайда
		slider["slide-zindex-Vis"] = slide_zindex_Vis;//z-index верхнего (видимого) слайда
		slider["slide-zindex-Unvis"] = slide_zindex_Unvis;//z-index нижнего (невидимого) слайда
		//END инициируем поля созданного объекта данными от пользлователя

		slider["move-old"] = move;//предыдущий режим слайдера (плэйера) - ключевые слова: play, pause
		slider["way-old"] = way;//предыдущее направление слайдера - ключевые слова: left, right
		slider["startIndx-old"] = startIndx;//предыдущие данные - индекс первого отображаемого слайда
		slider["slide-width-px"] = "0px";//размер слайда в пикселях [string]
		slider["start"] = true;//признак первого включения - нет слайда для сдвига, т.к. пользователь еще не выбрал направление

		slider["sliders_bgFiles"] = [];//массив ссылок на фоновые картинки слайдов: type [string]
		slider["sliders_user"] = [];//массив слайдов от пользователя: type [object HTMLElement]
		slider["sliders_DIV"] = [];//массив слайдов - полный: type [object HTMLDivElement]
		slider["sliders_work"] = [];//список отображаемых на текущий момент слайдов: type [object HTMLDivElement]
		slider["wSheet"] = null;//рабочая CSS-таблица
		
		slider["sliders_user"] = initArr_sliders_user(slider_id, slider_slide_class, slider_subwrapper_id);
		clearChildsByID(slider_id);//чистим slider-wrapper от "мусора"
		slider["slide-width-px"] = init_slideWidthPx(slider_id, slider["countVisual"], slider["wrapper-Width"]);
		slider["sliders_bgFiles"] = initArr_sliders_bgFiles('slider_' + indx + '_bgFiles');
		slider["sliders_DIV"] = initArr_sliders_DIV(slider);

/*		//секция отладка
		s = 'initSlider_Vars()\n';
//		for (var i = 0; i < slider["sliders_user"].length; i++) {
//			s += '[' + i + '] = "' + slider["sliders_user"][i] + '"\n';
//		}
		s += 'slider["subwrapper-ID"] = "' + slider["subwrapper-ID"] + '"';
		alert(s);
		//секция отладка*/
		
		if (slider["sliders_user"] && slider["sliders_DIV"]) {
			return slider;
		} else {
			alert('Ошибка!\nСлайдер №' + indx + ' не может быть инициирован1.\n' + errorMessage);//выводим пользователю сообщение об возникших ошибках
			errorMessage = '';//чистим глобальную errorMessage для возможности дальнейшего использования
			return false;
		}
	} else {
		if (slider_id) {
			errorMessage += 'slider_id = "' + slider_id + '"\n';
		}
		if (slider_slide_class) {
			errorMessage += 'slider_slide_class = "' + slider_slide_class + '"\n';
		}
		if (slider_tool_id) {
			errorMessage += 'slider_tool_id = "' + slider_tool_id + '"\n';
		}
		if (tool_arrowL_text) {
			errorMessage += 'tool_arrowL_text = "' + tool_arrowL_text + '"\n';
		}
		if (tool_arrowR_text) {
			errorMessage += 'tool_arrowR_text = "' + tool_arrowR_text + '"\n';
		}
		if (tool_arrowL_title) {
			errorMessage += 'tool_arrowL_title = "' + tool_arrowL_title + '"\n';
		}
		if (tool_arrowR_title) {
			errorMessage += 'tool_arrowR_title = "' + tool_arrowR_title + '"\n';
		}
		if (tool_manualLR) {
			errorMessage += 'tool_manualLR = "' + tool_manualLR + '"\n';
		}
		if (countVisual) {
			errorMessage += 'countVisual = "' + countVisual + '"\n';
		}
		if (count) {
			errorMessage += 'count = "' + count + '"\n';
		}
		if (timeWait) {
			errorMessage += 'timeWait = "' + timeWait + '"\n';
		}
		if (timeAnimation) {
			errorMessage += 'timeAnimation = "' + timeAnimation + '"\n';
		}
		if (onlyOne) {
			errorMessage += 'onlyOne = "' + onlyOne + '"\n';
		}
		if (animationTimingFunction) {
			errorMessage += 'animationTimingFunction = "' + animationTimingFunction + '"\n';
		}
		if (move) {
			errorMessage += 'move = "' + move + '"\n';
		}
		if (way) {
			errorMessage += 'way = "' + way + '"\n';
		}
		if (typeof(startIndx) == 'number') {
			errorMessage += 'startIndx = "' + startIndx + '"\n';
		}
		if (typeof(slide_zindex_Vis) == 'number') {
			errorMessage += 'slide_zindex_Vis = "' + slide_zindex_Vis + '"\n';
		}
		if (typeof(slide_zindex_Unvis) == 'number') {
			errorMessage += 'slide_zindex_Unvis = "' + slide_zindex_Unvis + '"\n';
		}
	
		alert('Ошибка!\nСлайдер №' + indx + ' не может быть инициирован2.\n' + errorMessage);//выводим пользователю сообщение об возникших ошибках
		errorMessage = '';//чистим глобальную errorMessage для возможности дальнейшего использования
		return false;
	}
}

/**
 * обработчик события: клик пользователем по элементам слайдера: любой слайд, кнопки "влево" и "вправо"
 * 
 * @param {string} slider_id id слайдера
 * @param {string} direct новое направление движения:
 * "left" - "Влево"; "right" - "Вправо"; {slide_ID} - слайд с id, Х - совпадает с №пп в массиве sliders["sliders_DIV"]
 */
function sliderTool_click(slider_id, direct) {
	var sl = findSliderByID(slider_id);

	//секция отладка
/*	var s = 'function sliderTool_click()\n';
	s += 'direct = "' + direct + '"\n';
	s += 'slider = "' + slider_id + '"\n';
	s += 'old way = "' + sl["way"] + '"\n';
	s += 'old move = "' + sl["move"] + '"';
	alert(s);
	//секция отладка*/
	
	//режим направления движения: меняем направление при нажатии кнопок "Вправо"-"Влево"
	if ((direct == "left")||(direct == "right")) {
		sl["way-old"] = sl["way"];
		sl["way"] = direct;
	}
	
	//для режима "работа-пауза" организуем режим тригера при любом клике
	if (sl["move"] == "pause") {
		sl["move"] = "play";

		/*BEGIN предыдущие данные - сохраняем*/
		if (sl["start"]) {
			sl["startIndx-old"] = sl["startIndx"];
		} else {
			//Дополнительная коррекция. Глюк при последовательном нажатии кнопок L-R
			recount_startIndxs(sl);
		}
		/*END предыдущие данные - сохраняем*/
	} else {
		sl["move"] = "pause";
		
		//Дополнительная коррекция. Глюк при последовательном нажатии кнопок L-R
		recount_startIndxs(sl);

		//при включении паузы = резко ускоряем движение
		if (sl["wSheet"] !== null) {
			sl["wSheet"].innerHTML = '';
		}
		for(var i = 0; i < sl["sliders_work"].length; i++) {
			sl["sliders_work"][i].style.animationName = '';//имя анимации
			sl["sliders_work"][i].style.animationDuration = 3 + 'ms';//время анимации, сек
			sl["sliders_work"][i].style.animationDelay = 3 + 'ms';//время задержки перед включением анимации, мсек
			sl["sliders_work"][i].style.animationIterationCount = 0;//число проигрываний анимации
		}
	}
	
	if (sl["move"] != "pause")//включаем движение
	{
		startMove(sl);
	}
}

/**
 * визуализируем кнопки управления слайдером "Вправо"-"Влево". Работаем с DOM
 * Причина: чистка всего в <div id="slider["wrapper-ID"]"> требует последующего восстановления стёртой информации.
 * Исключения в чистке: усложняются рассчёты позиционирования элементов. Намного проще - всё стереть
 * Описание:
 * 1) Жестко вбиты css-классы кнопок "Вправо"-"Влево", соответственно 'arrowR'-'arrowL'
 * 2) Используем уже имеющийся CSS. Единственное что корректируем: добавляем для wrapper-а
 * <div id=slider["tool-ID"]> параметр margin-top, который пересчитывается через slider["countVisual"]
 * 
 * @param {object} slider js-объект типа slider_def
 * @param {boolean} start коррекция дополнительного слайда при движении: true - без коррекции
 * вызов - из function showSlider()
 */
function showSliderToolLR(slider, start) {
	var wr = O(slider["wrapper-ID"]);
	
	//BEGIN div-wrapper элементов управления id=slider["tool-ID"]
	var tool = document.createElement('div');//создаём node div
	tool.id = slider["tool-ID"];//задаём его id
	wr.appendChild(tool);//визуализируем: добавляем в DOM узел tool, как child для wr

	//остальные настройки должны быть в css (wr > slider["tool-ID"])
	//кроме margin-top, которую требуется пересчитать при slider["count"] != slider["countVisual"]
	var rem = getComputedStyle(document.documentElement).fontSize;//1rem в px
//	var defrems = parseFloat(getComputedStyle(tool).marginTop) / parseFloat(rem);//margin-top изначальный count=countVisual в rem, отрицательное число

	var elH = getComputedStyle(O(slider["wrapper-ID"])).height;//height slider, число с px
	var defels = parseFloat(getComputedStyle(tool).marginTop) / parseFloat(elH);//margin-top изначальный count=countVisual в rem, отрицательное число
	if (slider["subwrapper-ID"].length > 0) {//есть дополнительный div->subwrapper
		var newMargin = -1.5*(parseFloat(elH) + parseFloat(getComputedStyle(tool).height)) - parseFloat(getComputedStyle(tool).marginTop);
	} else {
		if (start) {
			var delta = slider["count"] + defels;//число
		} else {
			var delta = slider["count"] + defels - 1;//число
		}
		var newels = -(slider["countVisual"] - delta);//число
		var newMargin = (newels * parseFloat(elH)) + 'px';//string
	}
	tool.style.marginTop = newMargin;
	
/*	//секция отладка
	var s = 'function showSliderToolLR()\n';
	s += 'def margin-top[px] = "' + getComputedStyle(tool).marginTop + '"\n';
	s += '\n';
	s += '1rem = "' + rem + '"\n';
	s += 'def margin-top[rem] = "' + defrems + 'rem"\n';
	s += '\n';
	s += 'elH = "' + elH + '"\n';
	s += 'def margin-top[elems] = "' + defels + '"\n';
	s += 'delta = "' + delta + '"\n';
	s += 'newels = "' + newels + '"\n';
	s += 'newMargin = "' + newMargin + '"\n';
	s += '\n';
	alert(s);
	//секция отладка*/
	//END div-wrapper элементов управления id=slider["tool-ID"]

	//BEGIN кнопка "Влево"
	var arrL = document.createElement('div');//создаём node div
	arrL.className = 'arrowL';//css-класс
	arrL.innerHTML = slider["tool-arrowL-text"];//текст в кнопке
	arrL.title = slider["tool-arrowL-title"];//всплывающая подсказка на кнопке
	arrL.addEventListener("click", function() { sliderTool_click(slider["wrapper-ID"], 'left'); }, false);//обработчик события - клик
	tool.appendChild(arrL);//визуализируем: добавляем в DOM узел arrL, как child для tool
	//остальные настройки кнопки "Влево" должны быть в её css
	//END кнопка "Влево"
	
	//BEGIN кнопка "Вправо"
	var arrR = document.createElement('div');//создаём node div
	arrR.className = 'arrowR';//css-класс
	arrR.innerHTML = slider["tool-arrowR-text"];//текст в кнопке
	arrR.title = slider["tool-arrowR-title"];//всплывающая подсказка на кнопке
	arrR.addEventListener("click", function() { sliderTool_click(slider["wrapper-ID"], 'right'); }, false);//обработчик события - клик
	tool.appendChild(arrR);//визуализируем: добавляем в DOM узел arrR, как child для tool
	//остальные настройки кнопки "Вправо" должны быть в её css
	//END кнопка "Вправо"
}

/**
 * выполнить при старте цикла движения: как при обычном старте, так и при смене слайдов: переопределяем переменные для выполнения движения:
 * 1) стартовый индекс: sl["startIndx"]
 * 2) массив текущих показываемых слайдов: sl["sliders_work"] в порядке показа слайдов в зависимости от выбранного режима: left = первый слайд - который уходит с экрана, последний слайд - который вползает на экран; right = первый слайд, который входит на экран, последний - который уходит. "Первый" - крайнее левое положение, "последний" - крайнее правое положение
 * 
 * @param {object} sl js-объект типа slider_def
 * вызов - из function sliderTool_click() и function nextSlide()
 */
function startMove(sl) {
	initArr_sliders_work(sl);//инициируем массив slider["sliders_work"]
	clearChildsByID(sl["wrapper-ID"]);//прибиваем стартовую/предыдущую визуализацию

	showSliderStartMove(sl);//визуализируем слайдер вначале движения/при смене отображаемых слайдов

/*	//секция отладка
	var s = 'function startMove()\n';
	alert(s);
	//секция отладка*/
}

/**
 * визуализируем слайдер вначале движения/при смене отображаемых слайдов
 * 
 * @param {object} sl js-объект типа slider_def
 * вызов - из function startMove()
 */
function showSliderStartMove(sl) {
	//width одного слайда
	var wrapper = O(sl["wrapper-ID"]);
	var wdth = slideWidth(sl["wrapper-ID"], sl["countVisual"], sl["wrapper-Width"]);
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//в %
	var wdth_px = init_slideWidthPx(sl["wrapper-ID"], sl["countVisual"], sl["wrapper-Width"]);//в px
//	var wdth_px = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth_px) / 100).toFixed(2) + 'px';//в px

	var keyfr = '';//паралельно будем формировать css-строку для будущей анимации (будущая добавка в DOM styleSheet)

/*	//секция отладка
	var s = 'function showSliderStartMove()\n';
	s += 'wdth = "' + wdth + '"\n';
	s += 'wdth_px = "' + wdth_px + '"\n';
//	alert(s);
	//секция отладка*/

	//выбираем обертку для добавляемых слайдов
	if (!sl["subwrapper-ID"]) {
		var wr = wrapper;
	} else {
		showSubwrapper(sl["wrapper-ID"], sl["subwrapper-ID"]);
		var wr = O(sl["subwrapper-ID"]);
	}

//	var s5 = 'function startMove()\n';//отладка
	for (var i = 0; i < sl["sliders_work"].length; i++) {
		//устанавливаем width (слетает почему-то...)
//		sl["sliders_work"][i].style.width = wdth;
//		s5 += '\n[' + i + '] width = "' + sl["sliders_work"][i].style.width + '"; "' + wdth_px + '"\n';//отладка
		sl["sliders_work"][i].style.width = wdth_px;
		//устанавливаем top (в каждой новой коллекции показываемых слайдов (sl["sliders_work"]) - переопределяется top каждого слайда в зависимости от текущей позиции [i] в коллекции sl["sliders_work"])
		sl["sliders_work"][i].style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height))/* - i*2*/) + 'px';
//		sl["sliders_work"][i].style.top = '0px';

		//почему-то не пашет напрямую sl["sliders_work"][i].style.animation - нет присвоения animationName
		//standart; Moz=Firefox, Webkit=Crome, Opera, Safari, O=Opera
		sl["sliders_work"][i].style.animationName = sl["wrapper-ID"] + '_move_' + i;//имя анимации
		sl["sliders_work"][i].style.animationDuration = sl["timeAnimation"] + 'ms';//время анимации, сек
		sl["sliders_work"][i].style.animationTimingFunction = sl["animationTimingFunction"];//временная функция анимации
		sl["sliders_work"][i].style.animationDelay = sl["timeWait"] + 'ms';//время задержки перед включением анимации, мсек
		sl["sliders_work"][i].style.animationIterationCount = 1;//число проигрываний анимации
		sl["sliders_work"][i].style.animationFillMode = 'forwards';//состояние объекта после анимации - Not support Safari
		
		//устанавливаем left (в каждой новой коллекции показываемых слайдов (sl["sliders_work"]) - переопределяется top каждого слайда в зависимости от текущей позиции [i] в коллекции sl["sliders_work"])
		if (sl["way"] == "right") {//дополнительный элемент: нулевой позицией в sl["sliders_work"]
//			sl["sliders_work"][i].style.left = (i * (parseFloat(wdth_px)) - parseFloat(wdth_px)).toFixed(2) + 'px';//px
			sl["sliders_work"][i].style.left = (i * (parseFloat(wdth_px)) - parseFloat(wdth_px)).toFixed(2) + '%';//%
//			sl["sliders_work"][i].style.left = '0px';
			
			//формируем список анимаций
			keyfr += '@keyframes ' + sl["wrapper-ID"] + '_move_' + i + ' {\n';//имя анимации [move_id]
//			keyfr += '0%   { left: ' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + 'px; }\n';//текущее значение left
//			keyfr += '100% { left: ' + (parseFloat(sl["sliders_work"][i].style.left) + parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//новое значение left;
			keyfr += '0%   { left: ' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + '%; }\n';//текущее значение left
			keyfr += '100% { left: ' + (parseFloat(sl["sliders_work"][i].style.left) + parseFloat(wdth_px)).toFixed(2) + '%; }\n}\n';//новое значение left;
//			s5 += 'left = "' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + '" => "' + (parseFloat(sl["sliders_work"][i].style.left) + parseFloat(wdth_px)).toFixed(2) + '"\n';//отладка
		}
		if (sl["way"] == "left") {//дополнительный элемент: last позицией в sl["sliders_work"]
//			sl["sliders_work"][i].style.left = (i * (parseFloat(wdth_px))).toFixed(2) + 'px';
			sl["sliders_work"][i].style.left = (i * (parseFloat(wdth_px))).toFixed(2) + '%';

			//формируем список анимаций
			keyfr += '@keyframes ' + sl["wrapper-ID"] + '_move_' + i + ' {\n';//имя анимации [id_move]
//			keyfr += '0%   { left: ' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + 'px; }\n';//текущее значение left
//			keyfr += '100% { left: ' + (parseFloat(sl["sliders_work"][i].style.left) - parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//новое значение left;
			keyfr += '0%   { left: ' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + '%; }\n';//текущее значение left
			keyfr += '100% { left: ' + (parseFloat(sl["sliders_work"][i].style.left) - parseFloat(wdth_px)).toFixed(2) + '%; }\n}\n';//новое значение left;
//			s5 += 'left = "' + (parseFloat(sl["sliders_work"][i].style.left)).toFixed(2) + '" => "' + (parseFloat(sl["sliders_work"][i].style.left) - parseFloat(wdth_px)).toFixed(2) + '"\n';//отладка
		}

/*		//секция отладка
		var s1 = '';
		s1 += '[' + i + '] = ' + sl["sliders_work"][i].id + '<br>';
		s1 += 'Top: "' + sl["sliders_work"][i].style.top + '" ? "' + getComputedStyle(sl["sliders_work"][i]).top + '"<br>';
		s1 += 'Left: "' + sl["sliders_work"][i].style.left + '" ? "' + getComputedStyle(sl["sliders_work"][i]).left + '"<br>';
		s1 += 'z-index: "' + sl["sliders_work"][i].style.zIndex + '" ? "' + getComputedStyle(sl["sliders_work"][i]).zIndex + '"<br>';
		s1 += 'width: "' + sl["sliders_work"][i].style.width + '" ? "' + getComputedStyle(sl["sliders_work"][i]).width + '"<br>';
		s1 += 'height: "' + sl["sliders_work"][i].style.height + '" ? "' + getComputedStyle(sl["sliders_work"][i]).height + '"<br>';
		if ((sl["way"] == "right")&&(i == 0)) {
		//дополнительный элемент: нулевой позицией в sl["sliders_work"]
//			sl["sliders_work"][i].style.left = '-' + wdth_px;
			s1 += 'additional<br>';
		}
		if ((sl["way"] == "left")&&(i == sl["sliders_work"].length-1)) {
		//дополнительный элемент: last позицией в sl["sliders_work"]
//			sl["sliders_work"][i].style.left = i * parseFloat(getComputedStyle(sl["sliders_work"][i-1]).width) + 'px';
//			sl["sliders_work"][i].style.top = '-' + getComputedStyle(sl["sliders_work"][i-1]).height;
			s1 += 'additional<br>';
		}
//		sl["sliders_work"][i].innerHTML = s1;
		//секция отладка*/

		wr.appendChild(sl["sliders_work"][i]);//добавляем готовый слайд в DOM-показываемого пользователю документа 

/*		//секция отладка
		s += '\n';//отладка
		s += '[' + i + '] = "' + sl["sliders_work"][i].id + '"\n';//отладка
		s += 'Top: "' + sl["sliders_work"][i].style.top + '" ? "' + getComputedStyle(sl["sliders_work"][i]).top + '"\n';
		s += 'Left: "' + sl["sliders_work"][i].style.left + '" ? "' + getComputedStyle(sl["sliders_work"][i]).left + '"\n';
		s += 'z-index: "' + sl["sliders_work"][i].style.zIndex + '" ? "' + getComputedStyle(sl["sliders_work"][i]).zIndex + '"\n';
		s += 'width: "' + sl["sliders_work"][i].style.width + '" ? "' + getComputedStyle(sl["sliders_work"][i]).width + '"\n';
		s += 'height: "' + sl["sliders_work"][i].style.height + '" ? "' + getComputedStyle(sl["sliders_work"][i]).height + '"\n';
		//секция отладка*/
	}
//	alert(s5);

	//begin отображаем кнопки управления слайдером
	if (sl["tool-manualLR"] == 1) {//имеется разрешение на кнопки "Вправо"-"Влево"
		if (!sl["subwrapper-ID"]) {
			showSliderToolLR(sl, false);
		} else {
			showSliderToolLR(sl, true);
		}
	}
	//end отображаем кнопки управления слайдером
	
	//запускаем "движение"
	if (sl["move"] == "play") {
//		css_edit(keyfr);//создаём новый тег style и добавляем в него keyfr
		sl["wSheet"] = css_edit(keyfr, sl["wSheet"]);//создаём новый тег style и добавляем в него keyfr
		if (sl["onlyOne"] != 1) {
			setTimeout(function() { nextSlide(sl); }, sl["timeWait"] + sl["timeAnimation"]);//выполняем по завершению анимации
		} else {
			setTimeout(function() { notSlide(sl); }, sl["timeWait"] + sl["timeAnimation"]);//выполняем по завершению анимации
		}
	}

/*	//секция отладка
	var s = 'function showSliderStartMove()\n';
	s += 'keyfr = "' + keyfr + '"\n';
//	alert(s);
	//секция отладка*/
}

/**
 * вызов сразу после загрузки всего HTML-я:
 * начальная инициализация переменных, стартовая визуализация слайдеров. Работаем с DOM
 */
function onLoadInitSliders() {
	//begin инициируем переменные
	sliders_Count = initVar_Int('sliders_Count', sliders_Count, true);//предполагаемое число слайдеров на странице
	var k = 0;//счетчик реального числа инициированных слайдеров
	if (sliders_Count > 0) {//попытка инициировать заданное число слайдеров
		for (var i = 0; i < sliders_Count; i++) {
			var sl = initSlider_Vars(i);
			if (sl !== false) {
				sliders[k] = sl;
//				alert('sliders[' + k + '] попытка [' + i + '] =>\n' + JSON.stringify(sliders[k], null, ' ') + '\n');//отладка
				k++;
			}
		}
	}
	sliders_Count = sliders.length;//сохраняем реальное число инициированных слайдеров
	//end инициируем переменные
	
	s = 'function onLoadInitSliders()\n';
	//begin отображаем в DOM
	for (var i = 0; i < sliders.length; i++) {
		showSlider(sliders[i]);
		s += '[' + i + '] = "' + sliders[i]["wrapper-ID"] + '"\n';
	}
	//end отображаем в DOM
	
/*	//секция отладка
	s += 'real count = "' + sliders.length + '"\n';
	alert(s);
	//секция отладка*/
}

/**
 * визуализируем начальное (невключенное) состояние слайдера в момент только после загрузки страницы
 * Работаем с DOM
 * 
 * @param {object} slider js-объект типа slider_def
 * вызов - из function onLoadInitSliders()
 */
function showSlider(slider) {
/*	//секция отладка
	var s1 = 'function showSlider()\n';
	s1 += 'wrapper-ID = "' + slider["wrapper-ID"] + '"\n';
	alert(s1);
	//секция отладка*/

	//выбираем обертку для добавляемых слайдов
	if (!slider["subwrapper-ID"]) {
		var wr = O(slider["wrapper-ID"]);
	} else {
		showSubwrapper(slider["wrapper-ID"], slider["subwrapper-ID"]);
		var wr = O(slider["subwrapper-ID"]);
	}

	//begin отображаем заданное начальное число слайдов
	var sDIV = slider["sliders_DIV"];
	for (var i = 0; i < sDIV.length; i++) {
		if (i < slider["countVisual"]) {
			var slide = sDIV[i];
			wr.appendChild(slide);//добавляем конкретный слайд в DOM
			
			//беда. left до вставки в документ (appendChild) никак не рассчитать
//			slide.style.left = (i * (parseFloat(getComputedStyle(slide).width))) + 'px';//px
			slide.style.left = (i * parseFloat(slide.style.width)) + '%';//%

/*			//секция отладка
			var s = '';
//			var s = 'function showSlider()\n<br>';
			s += '<br>\n[' + i + ']';
//			s += 'ID: "' + slide.id + '"';
//			s += '<br>\n';
//			s += 'left: "' + getComputedStyle(slide).left + '"<br>\n';
//			s += 'z-index: "' + getComputedStyle(slide).zIndex + '"<br>\n';
			s += 'w: "' + getComputedStyle(slide).width + '"<br>\n';
//			s += 'height: "' + getComputedStyle(slide).height + '"<br>\n';
			slide.innerHTML += s;//выводим отладочную инфу
			//секция отладка*/
		}
	}
	//end отображаем заданное начальное число слайдов
	
	//begin отображаем кнопки управления слайдером
	if (slider["tool-manualLR"] == 1) {//имеется разрешение на кнопки "Вправо"-"Влево"
		showSliderToolLR(slider, true);
	}
	//end отображаем кнопки управления слайдером

	if (slider["move"] != "pause")//включаем движение
	{
		startMove(slider);
	}
}

/**
 * Создаём div-оболочку слайдера, дополнителнительную - необязательную. Работаем с DOM
 * 
 * @param {object} slider js-объект типа slider_def
 */
function showSubwrapper(wrapper_ID, subwrapper_ID) {
	var wr = O(wrapper_ID);

	//если есть дополнительная wrapper - используем её
	if (subwrapper_ID !== false) {
		var subwr = document.createElement('div');//создаём node div
		subwr.id = subwrapper_ID;//задаём его id
		wr.appendChild(subwr);//визуализируем: добавляем в DOM узел subwr, как child для wr
	}

/*	//секция отладка
	var s = 'function subwrapper()\n';
	alert(s);
	//секция отладка*/
}

/**
 * Инициируем массив sliders_user - слайды от пользователя. Работаем с DOM
 * Сообщения об ошибках пишем в глобальную errorMessage.
 * Внимание!! при пользовательском вводе может быть полный бред.
 * Поэтому сохраняем только элементы {div[id=slider_id] > div[class=slider_slide_class]}. Остальное удаляем
 * 
 * @param {string} slider_id id div-слайдера
 * @param {string} slider_slide_class class div отдельного слайда
 * @param {string|false} slider_subwrapper_id id div-слайдера дополнительного wrapper
 * return {array|false} массив HTMLElement, либо false
 * Вызов: function initSlider_Vars(), куда и возвращаем данные
 */
function initArr_sliders_user(slider_id, slider_slide_class, slider_subwrapper_id) {
	var Arr_sliders_user = [];//итоговый массив слайдов от пользователя

	//если есть дополнительная wrapper - используем её
	var conteiner = null;
	if (slider_subwrapper_id === false) {
		conteiner = O(slider_id);
	} else {
		conteiner = O(slider_subwrapper_id);
	}

	if (conteiner.childNodes.length > 0) {
		var j = 0;
		for (var i = 0; i < conteiner.childNodes.length; i++) {
			if (conteiner.childNodes[i].outerHTML !== undefined) {
				if (conteiner.childNodes[i].className == slider_slide_class) {
					Arr_sliders_user[j] = conteiner.childNodes[i];
					j++;
				}
			}
		}
	}

/*	//секция отладка
	s = 'function initArr_sliders_user(' + slider_id + ', ' + slider_slide_class + ')\n';
	for (var i = 0; i < Arr_sliders_user.length; i++) {
		s += '[' + i + '] = "' + Arr_sliders_user[i] + '"\n';
	}
	alert(s);
	//секция отладка*/
	
	if (Arr_sliders_user.length > 0)
		return Arr_sliders_user;
	else {
		errorMessage += '\nСкрипт [slider.js:initArr_sliders_user(' + slider_id + ', ' + slider_slide_class + ')].\nВ DOM не найдено ни одного элемента с [css]: div[id=' + slider_id + '] > div[class=' + slider_slide_class + '].'
		return false;
	}
}

/**
 * при move == "play", при завершении анимации прокрутки кадра - делаем подготовку к следующему
 * 
 * @param {object} sl js-объект типа slider_def
 * вызов - по таймауту из function showSliderStartMove()
 * вызываем function startMove()
 */
function nextSlide(sl) {
	//секция отладка
	var s = 'function nextSlide()\n';
	s += 'sl["way"] = "' + sl["way"] + '"\n';
	s += 'sl["move"] = "' + sl["move"] + '"\n';
	s += 'sl["startIndx"] = "' + sl["startIndx"] + '"\n';
	//секция отладка*/
	
	sl["way-old"] = sl["way"];//

	//переопределяем old_startIndx, sliders_workStartIndx
	sl["startIndx-old"] = sl["startIndx"];
	//Внимание!!! почему-то для Right не требуется дополнительно корректировать sliders_workStartIndx???
	if (sl["way"] == "right") {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		sl["startIndx"] = sl["startIndx-old"] - 1;
		if (sl["startIndx"] < 0) {
			sl["startIndx"] = sl["sliders_DIV"].length-1;
		}
	}
	if (sl["way"] == "left") {
		sl["startIndx"] = sl["startIndx-old"] + 1;
		if (sl["startIndx"] > sl["sliders_DIV"].length-1) {
			sl["startIndx"] = 0;
		}
	}
/*	//секция отладка
	alert(s);
	//секция отладка*/

	startMove(sl);//новый слайд
}

/**
 * при move == "play", при завершении анимации прокрутки кадра - делаем подготовку к следующему
 * 
 * @param {object} sl js-объект типа slider_def
 * вызов - по таймауту из function showSliderStartMove()
 */
function notSlide(sl) {
	//секция отладка
	var s = 'function notSlide()\n';
	s += 'sl["way"] = "' + sl["way"] + '"\n';
	s += 'sl["move"] = "' + sl["move"] + '"\n';
	s += 'sl["startIndx"] = "' + sl["startIndx"] + '"\n';
	//секция отладка*/
	
	sl["way-old"] = sl["way"];//
	sl["move"] = "pause";
	
	//переопределяем old_startIndx, sliders_workStartIndx
	sl["startIndx-old"] = sl["startIndx"];
	if (sl["way"] == "right") {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		sl["startIndx"] = sl["startIndx-old"] - 1;
		if (sl["startIndx"] < 0) {
			sl["startIndx"] = sl["sliders_DIV"].length-1;
		}
	}
	if (sl["way"] == "left") {
		sl["startIndx"] = sl["startIndx-old"] + 1;
		if (sl["startIndx"] > sl["sliders_DIV"].length-1) {
			sl["startIndx"] = 0;
		}
	}
/*	//секция отладка
	alert(s);
	//секция отладка*/
}

/**
 * Добавляем новый тег style в head документа, куда и записываем styles. Работаем с DOM
 * 
 * @param {string} styles текстовая строка добавляемых css-правил
 * @param {null||document.styleSheet} ссылка на styleSheet (текущего документа), к которому привязан текущий слайдер, если null - создаём новый styleSheet
 * @return {document.styleSheet} ссылка на styleSheet (текущего документа), с которым работали
 * вызов - из function showSliderStartMove(), куда и возвращаем
 */
function css_edit(styles, wSheet) {
	var s = 'function css_edit()\n';//отладка

	//чтобы не плодить новые styleSheet в рамках одного документа = используем для каждого слайдера свой styleSheet
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


/*	//секция отладка
	s += 'document.styleSheets.length = ' + document.styleSheets.length + '\n';
	s += 'styles = [\n' + styles + ']\n';
	alert(s);
	//секция отладка*/

	return styleElt;//отдаём на уровень выше ссылку на node рабочей styleSheet
}
/**
 * инициируем массив slider["sliders_work"]
 * 
 * @param {object} sl js-объект типа slider_def
 * вызов - из function startMove()
 */
function initArr_sliders_work(sl) {
	//секция отладка
	var s = 'function initArr_sliders_work()\n';
	//секция отладка*/

	if (((sl["way"] == "right")&&(sl["move"] == "play"))||((sl["way-old"] == "right")&&(sl["move"] == "pause"))) {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		if (!sl["start"]) {//первый старт - не требуется сдвигать слайд
			sl["startIndx"] = sl["startIndx-old"] - 1;
			if (sl["startIndx"] < 0) {
				sl["startIndx"] = sl["sliders_DIV"].length-1;
			}
		} else {
			sl["start"] = false;
		}
		
		//переопределяем sliders_work
		sl["sliders_work"].length = 0;
		for (var i = 0; i < sl["countVisual"]; i++) {
			k = sl["startIndx"] + i;
//			s += '; k='+k;
			if (k > sl["sliders_DIV"].length-1)
				k = k - sl["sliders_DIV"].length;
//			s += '=>'+k;
//			s += '; '+sl["sliders_DIV"].id+'\n';
			sl["sliders_work"].push(createSlide(O(sl["wrapper-ID"]), k, 1, sl));
		}
		//дополнительный элемент: нулевой позицией в sliders_work, изначально k = sliders_workStartIndx + i + 1;
		k = sl["startIndx"] - 1;
		s += '; [kMIN]='+k;
		if (k < 0)
			k = sl["sliders_DIV"].length - 1;
		s += '=>' + k;
		s += '; ' + sl["sliders_DIV"][k].id + '\n';
		sl["sliders_work"].unshift(sl["sliders_DIV"][k]);
	}
	if (((sl["way"] == "left")&&(sl["move"] == "play"))||((sl["way-old"] == "left")&&(sl["move"] == "pause"))) {
		//переопределяем sliders_workStartIndx = сдвиг слайда
		if (!sl["start"]) {//первый старт - не требуется сдвигать слайд
			sl["startIndx"] = sl["startIndx-old"] + 1;
			if (sl["startIndx"] > sl["sliders_DIV"].length-1)
				sl["startIndx"] = 0;
		} else {
			sl["start"] = false;
		}
		
		//переопределяем sliders_work
		sl["sliders_work"].length = 0;
		for (var i = 0; i < sl["countVisual"]; i++) {
			k = sl["startIndx"] + i;
//			s += '; k='+k;
			if (k > sl["sliders_DIV"].length-1)
				k = k - sl["sliders_DIV"].length;
//			s += '=>'+k;
//			s += '; '+sl["sliders_DIV"].id+'\n';
			sl["sliders_work"].push(createSlide(O(sl["wrapper-ID"]), k, 1, sl));
		}
		//дополнительный элемент: last позицией в sliders_work, изначально k = sliders_workStartIndx + i + 1;
		k = k + 1;
//		s += '; [kMAX]='+k;
		if (k > sl["sliders_DIV"].length-1)
			k = k - sl["sliders_DIV"].length;
//		s += '=>'+k;
//		s += '; '+sl["sliders_DIV"][k].id+'\n';
		sl["sliders_work"].push(sl["sliders_DIV"][k]);
	}

/*	//секция отладка
	alert(s);
	//секция отладка*/
}

/**
 * переопределяем slider["startIndx-old"] и slider["startIndx"] при клацанье кнопками left-right
 * 
 * @param {object} slider js-объект типа slider_def
 * старая function initIndxs() v.4.00
 * вызов - из function sliderTool_click()
 */
function recount_startIndxs(slider) {
	if (slider["move"] == "pause") {
		if ((slider["way-old"] == "right")&&(slider["way"] == "left")) {
//			alert('pause R->L');//отладка
			var t = slider["sliders_work"];
			if (t[1]) {
				var tmp = t[1].id.split('_');
				slider["startIndx"] = parseInt(tmp[1]) - 2;
			}
			slider["startIndx-old"] = slider["startIndx"] - 1;
		}
		if ((slider["way-old"] == "left")&&(slider["way"] == "right")) {
//			alert('pause L->R');//отладка
			var t = slider["sliders_work"];
			if (t[1]) {
				var tmp = t[1].id.split('_');
				slider["startIndx"] = parseInt(tmp[1]) + 1;
			}
			slider["startIndx-old"] = slider["startIndx"] + 1;
		}
	} else {
		if (!slider["start"]) {
			if ((slider["way-old"] == "right")&&(slider["way"] == "left")) {
//				alert('play R->L');//отладка
				if (slider["onlyOne"] != 1) {
					var t = slider["sliders_work"];
					if (t[1]) {
						var tmp = t[1].id.split('_');
						slider["startIndx"] = parseInt(tmp[1]);
					}
					slider["startIndx-old"] = slider["startIndx"] - 1;
				} else {
					var t = slider["sliders_work"];
					if (t[1]) {
						var tmp = t[1].id.split('_');
						slider["startIndx"] = parseInt(tmp[1]) - 1;
					}
					slider["startIndx-old"] = slider["startIndx"] - 1;
				}
			}
			if ((slider["way-old"] == "left")&&(slider["way"] == "right")){
//				alert('play L->R');//отладка
				if (slider["onlyOne"] != 1) {
					var t = slider["sliders_work"];
					if (t[1]) {
						var tmp = t[1].id.split('_');
						slider["startIndx"] = parseInt(tmp[1]) - 1;
					}
					slider["startIndx-old"] = slider["startIndx"] + 1;
				} else {
					var t = slider["sliders_work"];
					if (t[1]) {
						var tmp = t[1].id.split('_');
						slider["startIndx"] = parseInt(tmp[1]);
					}
					slider["startIndx-old"] = slider["startIndx"] + 1;
				}
			}
		}
	}

	//BEGIN Дополнительная коррекция
	if (slider["startIndx-old"] < 0) {
		slider["startIndx-old"] = slider["sliders_DIV"].length - 1 + slider["startIndx-old"] + 1;
	}
	if (slider["startIndx-old"] > slider["sliders_DIV"].length-1) {
		slider["startIndx-old"] = 0 + slider["startIndx-old"] - 1;
	}
	if (slider["startIndx"] < 0) {
		slider["startIndx"] = slider["sliders_DIV"].length - 1 + slider["startIndx"] + 1;
	}
	if (slider["startIndx"] > slider["sliders_DIV"].length-1) {
		slider["startIndx"] = 0 + slider["startIndx"] - 1;
	}
	//END Дополнительная коррекция

/*	//секция отладка
	var s = 'function recount_startIndxs()\n';
	alert(s);
	//секция отладка*/
}

/**
 * Ищем в общем списке слайдеров необходимый по его id
 * 
 * @param {string} slider_id id искомого слайдера
 * return {object|false} slider js-объект типа slider_def | false
 */
function findSliderByID(slider_id) {
	for (var i = 0; i < sliders.length; i++) {
		var sl = sliders[i];
		if (sl["wrapper-ID"] == slider_id) {
			var res = sl;
		}
	}
	if (!res) {//проверяем существование переменной
		var res = false;
	}
	
	return res;
}

/**
 * формируем отдельный слайд вплоть до его визуализации/привязки к node wrapper
 * 
 * @param {HTMLElement} wrapper обертки слайдера
 * @param {integer} i DIV текущий визуализуруемый слайд
 * @param {integer} standart признак слайда, [default=1], 1 - видимый слайд, else - проявляющийся
 * @param {object} slider js-объект типа slider_def
 * return {HTMLElement}
 * Вызов: function initArr_sliders_DIV(), куда и возвращаем данные
 */
function createSlide(wrapper, i, standart, slider) {
	//формируем div - отдельный слайд
	var slide = document.createElement('div');
	slide.className = slider["slide-Class"];
	if (standart == 1) {//задаём id, согласно standart
		slide.id = wrapper.id + '_slide_' + i;//видимый слайд
	} else {
		slide.id = wrapper.id + 'slide_' + i + '_copy';//слайд-копия уже существующего (проявляющийся слайд)
	}
	if (i < slider["sliders_bgFiles"].length) {//фоновая картинка слайда, если есть
		slide.style.backgroundImage = "url('" + slider["sliders_bgFiles"][i] + "')";
	}
	//width: % или px
//	slide.style.width = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(sWidth) / 100) + 'px';//px
	slide.style.width = slider["slide-width-px"];//оставляем в текущем виде//%
	
	slide.style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height))/* - i*2*/) + 'px';
	//фильтруем верхний=видимый=бОльший/нижний=невиждимый=мЕньший слайды
	if (i < slider["countVisual"]) {
	//видимый
		slide.style.zIndex = slider["slide-zindex-Vis"];
	} else {//невидимый
		slide.style.zIndex = slider["slide-zindex-Unvis"];
	}
	//интегрируем то что ввел пользователь
	if (i < slider["sliders_user"].length) {
		slide.innerHTML = slider["sliders_user"][i].innerHTML;
	}

	//добавляем обработчик события - клик
	slide.addEventListener("click", function() {sliderTool_click(slider["wrapper-ID"], slide.id);}, true);

	return slide;
}

/**
 * Инициируем переменную slide-width-px
 *
 * @param {string} slider_id id div-слайдера
 * @param {int} countVisual целое единовременно видимое число слайдов на экране
 * @param {string} slider_width width div-слайдера
 * return {string} размер слайда в пикселях, например "0px"
 * Вызов: function initSlider_Vars(), куда и возвращаем данные
 */
function init_slideWidthPx(slider_id, countVisual, slider_width) {
	var wr = O(slider_id);//прямой линк на узел слайдера
	
	/*Внимание! width видимого слайда в %. Пришлось вынести на уровень выше (в вызывающую ф-цию), т.к. почему-то расчёт в function createSlide() давал разные результаты для разных i, заметным на глаз становился результат при i>3??? i - номер слайда*/
	var wdth = slideWidth(slider_id, countVisual, slider_width);
	var slideWidth_Px = (parseFloat(getComputedStyle(wr).width) * parseFloat(wdth) / 100).toFixed(2) + 'px';//в px
	
//	return slideWidth_Px;//px
	return wdth;//%
}

/**
 * формируем значение width отдельного слайда, в %. Прежде всего для единообразия алгоритма рассчета
 * 
 * @param {string} slider_id id div-слайдера
 * @param {int} countVisual целое единовременно видимое число слайдов на экране
 * @param {string} slider_width width div-слайдера
 * return {string} [число%] 
 * Вызов: function init_slideWidthPx(), куда и возвращаем данные
 */
function slideWidth(slider_id, countVisual, slider_width)
{
	var wr = O(slider_id);//прямой линк на узел слайдера
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//простой рассчет

	var koef = 0*countVisual;//спецкоэффициент, введён из-за непонятной мне неточности в рассчете width
	
	//счёт через px с переводом итога в %. рассчет для box-sizing: border-box; Из width необходимо отнять padding-left, padding-right, border-left-width, border-right-width
	var box = wr.getBoundingClientRect();
	var w = box.width || (box.right - box.left);
	
	//в firefox при появлении скролла выдаёт не верное значение
	var wdth = (100 * (parseFloat(slider_width) - parseFloat(getComputedStyle(wr).paddingLeft) - parseFloat(getComputedStyle(wr).paddingRight) - parseFloat(getComputedStyle(wr).borderLeftWidth) - parseFloat(getComputedStyle(wr).borderRightWidth)) / (countVisual * (parseFloat(slider_width) + koef))) + '%';

/*	//секция отладка
	var s = 'function slideWidth(' + slider_id + ')\n';//отладка
	s += 'slide.wdth = "' + wdth + '"\n';
	s += 'slide.width = "' + (parseFloat(getComputedStyle(wr).width) * parseFloat(wdth) / 100).toFixed(2) + 'px' + '"\n';
	s += 'getComputedStyle(wrapper).width = "' + getComputedStyle(wr).width + '"\n';
	s += 'wrapper.getBoundingClientRect.width = "' + w + '"\n';
	s += 'wrapper.offsetWidth = "' + wr.offsetWidth + '"\n';
	s += 'wrapper.width = "' + slider_width + '"\n';
	s += 'countVisual = "' + countVisual + '"\n';
	s += 'koef = "' + koef + '"\n';
//	s += 'wrapper.paddingLeft = "' + getComputedStyle(wr).paddingLeft + '"\n';
//	s += 'wrapper.paddingRight = "' + getComputedStyle(wr).paddingRight + '"\n';
//	s += 'wrapper.borderLeftWidth = "' + getComputedStyle(wr).borderLeftWidth + '"\n';
//	s += 'wrapper.borderRightWidth = "' + getComputedStyle(wr).borderRightWidth + '"\n';
//	alert(s);
	//секция отладка*/

	return wdth;
}

/**
 * Инициируем массив sliders_DIV - полный массив слайдов
 * 
 * @param {object} slider js-объект типа slider_def
 * Внимание! Не все внутренние переменные инициированы
 * return {array[HTMLElement]} - полный массив слайдов
 * Вызов: function initSlider_Vars(), куда и возвращаем данные
 */
function initArr_sliders_DIV(slider) {
	var s = 'function initArr_sliders_DIV()\n';//отладка
	var wr = O(slider["wrapper-ID"]);//прямой линк на узел слайдера
	var slidersDIV = [];
	
	//создаём список слайдов slidersDIV
	for (var i = 0; i < slider["count"]; i++)
	{
		//добавляем элемент в конец стека
		slidersDIV.push(createSlide(wr, i, 1, slider));//width в px
		
		var slide = slidersDIV[slidersDIV.length-1];//отладка
		s += '\n[' + i + '] ID: "' + slide.id + '"\n';//отладка
	}
	
	//секция отладка
//	alert(s);
	//секция отладка*/
	
	if (slidersDIV.length > 0) {
		return slidersDIV;
	} else {
		return false;
	}
}

/**
 * Инициируем массив sliders_bgFiles - массив ссылок на фоновые картинки слайдов
 * Отличие от прочих инициализаций - массив задан явно в html, в переменной с именем varID
 * 
 * @param {string} varID id-элемента для инициализации
 * return {array} bgFiles массив ссылок на фоновые картинки слайдов, может быть пустым
 * Вызов: function initSlider_Vars(), куда и возвращаем данные
 */
function initArr_sliders_bgFiles(varID) {
	var bgFiles = [];
	if (eval('window.' + varID)) {//проверяем существование переменной
		bgFiles = eval(varID);
	}

/*	//секция отладка
	var s = 'function initArr_sliders_bgFiles()\n';
	for (var i = 0; i < bgFiles.length; i++)
		s += '[' + i + '] = "' + bgFiles[i] + '"\n';
	alert(s);
	//секция отладка*/
	
	return bgFiles;
}

/**
 * Создаём объект по прототипу. ECMAScript 5 или старая версия
 * 
 * @param {object} obj объект-прототип, который наследуется
 * return {object}
 */
function inherit(obj) {
	if (obj == null) throw TypeError();	//obj не может быть null
	if (Object.create)	//if Object.create определена
		return Object.create(obj);
	var t = typeof(obj);	//else определяем тип
	if (t !== "object" && t !== "function") throw TypeError(); //проверяем тип
	function f() {};	//фиктивный конструктор
	f.prototype = obj;	//сохраняем в прототип ссылку на объект obj
	return new f();	//используем f() для создания наследника obj
}

/**
 * чистим DOM slider_id от любых childNode. Работаем с DOM
 * 
 * @param {string} el_id id очищаемого элемента
 */
function clearChildsByID(el_id) {
	wr = O(el_id);//id очищаемого элемента

	//секция отладка
	var s = 'function clearChildsByID()\n';
	s += '[' + wr.id + '] "' + wr.nodeName + '" => "' + getComputedStyle(wr).width + '"\n';
	//секция отладка*/

	while (wr.lastChild)
	{
		//секция отладка
		var t = wr.lastChild;
		if (t.nodeName == "DIV") {
			s += '[' + t.id + '] "' + t.nodeName + '" => "' + getComputedStyle(t).width + '"\n';
		}//секция отладка*/
		
		wr.removeChild(wr.lastChild);
	}

//	alert(s);//отладка
}

/**
 * Инициируем переменную типа string из html[id.value]
 * Сообщения об ошибках пишем в глобальную errorMessage.
 * 
 * @param {string} varID id-элемента для инициализации
 * @param {string} defValue значение по-умолчанию, применяется при несоответствии типов переменных
 * @param {boolean} errMessage y/n сообщение об ошибке
 * return {string|false} HTMLElement, либо false
 */
function initVar_str(varID, defValue, errMessage) {
	if (O(varID) === null) {
		if (errMessage === true) {
			errorMessage += '\nСкрипт [slider.js:initVar_str(' + varID + ', ' + defValue + ', ' + errMessage + ')].\nВ DOM отсутствует обязательный параметр: "' + varID + '".'
//			alert('Ошибка!\nСкрипт [slider.js] прекращает работу.\nОтсутствует обязательный параметр: "' + varID + '".');
		}
		return false;
	}
	var res = O(varID).value;
	if (typeof(defValue) !== typeof(res)) {
		res = defValue;
	}
	
	return res;
}

/**
 * Инициируем переменную типа int из html[id.value]
 * Сообщения об ошибках пишем в глобальную errorMessage.
 * 
 * @param {string} varID id-элемента для инициализации
 * @param {int} defValue значение по-умолчанию, применяется при несоответствии типов переменных
 * @param {boolean} errMessage y/n сообщение об ошибке
 * return {int|false} число, либо false
 */
function initVar_Int(varID, defValue, errMessage) {
	if (O(varID) === null) {
		if (errMessage === true) {
			errorMessage += '\nСкрипт [slider.js:initVar_Int(' + varID + ', ' + defValue + ', ' + errMessage + ')].\nВ DOM отсутствует обязательный параметр: "' + varID + '".'
//			alert('Ошибка!\nСкрипт [slider.js] прекращает работу.\nОтсутствует обязательный параметр: "' + varID + '".');
		}
		return false;
	}
	var res = parseInt(O(varID).value);
	if (typeof(defValue) !== typeof(res)) {
		res = defValue;
	}
	
	return res;
}

/**
 * Инициируем переменную типа element из html[id]
 * Сообщения об ошибках пишем в глобальную errorMessage.
 * 
 * @param {string} varID id-элемента для инициализации
 * @param {boolean} errMessage y/n сообщение об ошибке
 * return {string|false} id div-элемента (wrapper слайдера) либо false
 */
function initVar_ID(varID, errMessage) {
	if (O(varID) === null) {
		if (errMessage === true) {
			errorMessage += '\nСкрипт [slider.js:initVar_ID(' + varID + ', ' + errMessage + ')].\nВ DOM отсутствует обязательный параметр: "' + varID + '".'
//			alert('Ошибка!\nСкрипт [slider.js] прекращает работу.\nОтсутствует обязательный параметр: "' + varID + '".');
		}
		return false;
	}
	if (O(O(varID).value) === null) {
		if (errMessage === true) {
			errorMessage += '\nСкрипт [slider.js:initVar_ID(' + varID + ', ' + errMessage + ')].\nВ DOM отсутствует обязательный параметр: "' + O(varID).value + '".'
//			alert('Ошибка!\nСкрипт [slider.js] прекращает работу.\nОтсутствует обязательный параметр: "' + O(varID).value + '".');
		}
		return false;
	}
	
	return O(varID).value;
}

/**
 * Для сокращения текста реализуем механизм document.getElementById(idName)
 * 
 * @param {string} idName id элемента
 * return {HTMLElement} HTMLElement с id=idName
 */
function O(idName) {
	return document.getElementById(idName);
}
