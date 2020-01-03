/**
 * Slider Version 4.01.2019.08.30
 * 
 * �������� ������������: 
 * 1. ������ ����� �������� �������������. ��������: CSS (@keyframes) - ������������ �������������� stylesheet ������ ��� ����� ��������.
 * 2. ������ ������ (������ ��������� �������� ��������):
 * 2.1 ������ ����������������� ����������: ������ "�����", "������" (���� ����������� �������������� ���/���� ������ "�����" � "������" ��.Slider_Manual), � ����� ���� �� ������
 * 2.2 �������������� ����� ������: "�������� ���������� ������ �� �����", "�������� ���������� ����� �� �����", "�����", "�������� ������ �� 1 ����� � ���������", "�������� ����� �� 1 ����� � ���������"
 * 2.3 
 * 3. ���������� � ��������� CSS (����������� CSS):
 * 3.1 ��������� �������� <div id="wrapperSliderV4"> (��� ��������� id ��.Slider_nameWrapper):
 * 	box-sizing: border-box;
 * 	display: block;
 *	overflow: hidden;
 *	padding: 0;	����������� ��������� padding-left � padding-right, �� ������� �������������� ��������
 * 3.2 ��������� ����� <div class="slide"> (��� ��������� ������ ��.Slider_classSlide):
 * 	position: relative;
 *	width - ������� �� js-�������
 * 	height: 100%;
 * 	display: block;
 * 	box-sizing: border-box;
 *	z-index - ������� �� js-������� (��.zindexVis, zindexUnVis), ��� ����� �������� ������ � css
 * 3.3 ��������� ��������� ���������� ��������� <div class="slider_tool"> (��� ��������� ������ ��.Slider_nameTool):
 * 	display: block;
 * 	background-color: transparent;
 * 	box-sizing: border-box;
 *	height: ������ ��������� �� ������� � height ������ "�����" � "������"
 * 	position: relative;
 *	z-index: [default]=45; ����� ������, � ��������, ��� ������ ���� ������ zindexVis � zindexUnVis, � ����� z-index ������ html-�������� �� ������, �� ������ z-index ������ "�����" � "������"
 *	margin-top - ������� �� js-������� (default = ����� ��������), ����������� ������ ��������� ��� ����� �������� �������� �� ����
 * 3.4 ������ ���������� "�����" � "������" <div class="slider_toolArroyL"> � <div class="slider_toolArroyR"> (��� ����������� ��������� class):
 * 	display: block;
 * 	box-sizing: border-box;
 * 	position: relative;
 *	z-index: [default]=50; ����� ������, � ��������, ��� ������ ���� ������ zindexVis � zindexUnVis
 *	float: [left || right]; �������������� ��� ������ "�����" � "������"
 *	����������� ��������� ����� ������� [��.nameBtnLeft, hintBtnRight] �� �������
 *	����������� ��������� ������ title [��.hintBtnLeft, hintBtnRight] �� �������
 *	margin-top: [default]0; ����������� ��������� ������������� �������� ������������ slider_tool, ��� +, ��� � -
 *	margin-left, margin-right, margin-bottom - �� ���������
 * 4. �������������� �������:
 * 4.1 Slider_slideCountVisual ������, ���� ����� Slider_slideCount
 * 4.2 ��� slider_toolArroyL:hover � slider_toolArroyR:hover �� ������������� ������������ box-shadow
 */

/*BEGIN ���� <���������� � ��������� ������������� ���������� ����������>*/
/*BEGIN ���� <��������������� - ���������������� �� input[type=hidden]>*/
var outerCSSLinks = 1;//��������� ����� ������ CSS � ��������� (�� ������ ������ ��������): ������ 'link rel="stylesheet"'=>+1; ������ ��� '<style>'=>+1
var Slider_slideCountVisual = 2;//����� ������������� ������� ����� ������� �� ������
var Slider_slideCount = 2;//����� ����� �������
var Slider_Manual = 1;//������� ������ ������� ����������: [1] - ����; [����� ������, �� ������ 0] - ���
var Slider_TimeWait = 5000;//�������� ����� �������, �������, 1000���� = 1���
var Slider_Time = 5000;//����� ��������, �������, 1000���� = 1���
var Slider_OnlyOne = 0;//����������� ��� ������ 1 ���, [1] - ��; [����� ������, �� ������ 0] - ���
var animationTimingFunction = 'ease-out';//��������� ������� ������������� ������ animation-timing-function (CSS)
var Slider_nameWrapper = 'wrapperSliderV4';//div-������� �������� [string]
var Slider_classSlide = 'slide';//class ������ [string]
var Slider_nameTool = 'slider_tool';//div-������� �������� [string]
var zindexVis	= 25;//z-index �������� (��������) ������
var zindexUnVis	= 5;//z-index ������� (����������) ������
/*END ���� <��������������� - ���������������� �� input[type=hidden]>*/

/*BEGIN ���� <����������>*/
var wSheet = null;//������� CSS-�������
var Slider_slideUser = [];//������ ������� �� ������������: type [object HTMLElement]
var slidersDIV	= [];//������ ������� - ������: type [object HTMLDivElement]
var sliders_work = [];//������ ������������ �� ������� ������ �������: type [object HTMLDivElement]
var nameBtnLeft	= 'Left';//����� � ������ ������ ����������� �������� "�����"
var nameBtnRight = 'Right';//����� � ������ ������ ����������� �������� "������"
var hintBtnLeft = 'Previous slide';//��������� �� ������ ������ ����������� �������� "�����"
var hintBtnRight = 'Next slide';//��������� �� ������ ������ ����������� �������� "������"
var move = 'pause';//����� �������� (�������) - �������� �����: play, pause
var start = true;//������� ������� ��������� - ��� ������ ��� ������, �.�. ������������ ��� �� ������ �����������
var way = 'left';//����������� �������� - �������� �����: left, right
var old_startIndx = sliders_workStartIndx;//���������� ������ - ������ ������� ������������� ������
var sliders_workStartIndx = 0;//������ ������� ������������� ������
var old_way = way;
var slideWidth_Px = '0px';//������ ������ � ��������
/*END ���� <����������>*/
/*END ���� <���������� � ��������� ������������� ���������� ����������>*/

/**
 * ����� ����� ����� �������� ����� HTML-�:
 * �������������� ������������� ����������, �������� ���������� ����������
 * �������� �������� � ����������� �����������, DOM
 */
function onLoadSlider() {
	//���������� �� input[type=hidden] - �������� �� ������������ ��������
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

	//�������� ����� ���������� ��������
	Slider_slideUser.length = 0;//������ ������� �� ������������, �������� � div �������� �������
	slidersDIV.length = 0;//������ ������� - ������
	sliders_work.length = 0;//������ ������������ �� ������� ������ �������
	
	//���������� � ����������� �� ������� ��������
	outerCSSLinks = document.styleSheets.length;//����� styleSheet �� ��������� ��������
	initArr_Slider_slideUser();//init global array Slider_slideUser
	initArr_slidersDIV();//init global array slidersDIV
	
	showSlider();//������������ ���������� ��������� ��������

	//��������� ������ ����������, ���� ���� ��������
	if (Slider_Manual == 1) {
		showSliderTool();
	}

	/*//BEGIN ������ "�������"
	var s = 'function onLoadSlider()\n';
	s += 'Slider_Files = ' + Slider_Files.join() + '\n';
	s += 'Slider_slideUser = ' + Slider_slideUser.join() + '\n';
	s += 'slidersDIV = ' + slidersDIV.join() + '\n';
	alert(s);
	//END ������ "�������"*/
}

/**
 * ���������� ���������� ������ Slider_slideUser
 * 
 * ��������!! ��� ���������������� ����� ����� ���� ������ ����.
 * ������� ��������� ������ �������� [class=Slider_classSlide]. �� ��������� �������
 * �������� �������� � DOM
 * �����: function onLoadSlider()
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
	clearWrapper();//������ div-wrapper �������� �� ����������������� ������
}

/**
 * ������ DOM Slider_nameWrapper �� ����� childNode
 * ����� - �� function initArr_Slider_slideUser()
 * ��������!! Firefox. � ���-������� �������� �������, ��� ��� ����� ����������� ��� ����� ����� ������������ ������� - ������������ ����� styleSheet = ���� �� ����� ���� ���.
 * �������������� (��� ��� ������ ���� firefox) �����:
 * (1) ����������� ������ "�������" - �����, ��� �� �������� ����� ����� styleSheets, � �����, �����, ��� innerHTML ���������������� ������ �������).
 * (2) ������� � ������� Chrome/Opera.
 * �������� �������� � DOM
 */
function clearWrapper() {
	wrapper = O(Slider_nameWrapper);//wrapper ��������
	while (wrapper.lastChild)
	{
		wrapper.removeChild(wrapper.lastChild);
	}

	/*//BEGIN ������ "�������"
	var s = 'function clearWrapper()\n';
	s += 'outerCSSLinks = ' + outerCSSLinks + '\n';
	s += 'document.styleSheets.length = ' + document.styleSheets.length + '\n';
	if (document.styleSheets[outerCSSLinks])
		s += 'innerHTML = ' + wSheet.innerHTML + '\n';
	alert(s);
	//END ������ "�������"*/
}

/**
 * ��� ���������� ������ ��������� �������� document.getElementById(idName)
 * 
 * @param {string} idName id ��������
 * return {Element} Element � id=idName
 */
function O(idName) {
	return document.getElementById(idName);
}

/**
 * ���������� ���������� ������ slidersDIV
 * �����: function onLoadSlider()
 */
function initArr_slidersDIV() {
	var s = 'function initArr_slidersDIV()\n';
	var wrapper = O(Slider_nameWrapper);//������ ���� �� ���� ��������
	/*��������! width �������� ������ � %. �������� ������� �� ������� ���� (� ���������� �-���), �.�. ������-�� ������ � function createSlide() ����� ������ ���������� ��� ������ i, �������� �� ���� ���������� ��������� ��� i>3???*/
	var wdth = slideWidth();
	slideWidth_Px = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100).toFixed(2) + 'px';//� px

	//������ ������ ������� slidersDIV
	for (var i = 0; i < Slider_slideCount; i++)
	{
		//��������� ������� � ����� �����
//		slidersDIV.push(createSlide(wrapper, i, wdth, 1));
		slidersDIV.push(createSlide(wrapper, i, slideWidth_Px, 1));
		var slide = slidersDIV[slidersDIV.length-1];
		s += '\n['+i+'] ID: "' + slide.id + '"\n';//���������� ����
	}
//	alert(s);//���������� ����
}

/**
 * ��������� �������� width ���������� ������, � %. ������ ����� ��� ������������ ��������� ��������
 * 
 * return {string} [�����%]
 * �����: function initArr_slidersDIV() � startMove(), ���� � ���������� ������
 */
function slideWidth()
{
	var s = 'function slideWidth()\n';//�������

	var wrapper = O(Slider_nameWrapper);//������ ���� �� ���� ��������
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//��� ����� padding
	var wdth = (100 * (parseFloat(getComputedStyle(wrapper).width) - parseFloat(getComputedStyle(wrapper).paddingLeft) - parseFloat(getComputedStyle(wrapper).paddingRight)) / (Slider_slideCountVisual * parseFloat(getComputedStyle(wrapper).width))) + '%';//� ������ padding
	s += 'wdth = "' + wdth + '"\n';
	s += 'width = "' + (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100) + 'px' + '"\n';
	s += 'wrapper.width = "' + getComputedStyle(wrapper).width + '"\n';
	s += 'wrapper.paddingLeft = "' + getComputedStyle(wrapper).paddingLeft + '"\n';
	s += 'wrapper.paddingRight = "' + getComputedStyle(wrapper).paddingRight + '"\n';
	
//	alert(s);
	return wdth;
}


/**
 * ��������� ��������� ����� ������ �� ��� ������������/�������� � node wrapper
 * 
 * @param {HTMLElement} wrapper ������� ��������
 * @param {integer} i DIV ������� ��������������� �����
 * @param {string} sWidth width ������, [�����+������� ���������/%|px/]
 * @param {integer} standart ������� ������, [default=1], 1 - ������� �����, else - �������������
 * return {HTMLElement}
 * �����: function initArr_slidersDIV(), ���� � ���������� ���� �� ��������� slide
 */
function createSlide(wrapper, i, sWidth, standart) {
	//��������� div - ��������� �����
	var slide = document.createElement('div');
	slide.className = Slider_classSlide;
	if (standart == 1) {//����� id, �������� standart
		slide.id = 'slide_'+i;//������� �����
	} else {
		slide.id = 'slide_'+i+'_copy';//�����-����� ��� ������������� (������������� �����)
	}
	if (i < Slider_Files.length) {//������� �������� ������, ���� ����
		slide.style.backgroundImage = "url('" + Slider_Files[i] + "')";
	}
	//width ��������� �� % � px
//	slide.style.width = ((parseFloat(getComputedStyle(wrapper).width) * parseFloat(sWidth) / 100).toFixed(2) - Slider_slideCountVisual) + 'px';
//	slide.style.width = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(sWidth) / 100) + 'px';
	slide.style.width = sWidth;//��������� ��������
	slide.style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height)) - i*2) + 'px';
	//��������� �������=�������=�������/������=����������=������� ������
	if (i < Slider_slideCountVisual) {
	//�������
		slide.style.zIndex = zindexVis;
	} else {//���������
		slide.style.zIndex = zindexUnVis;
	}
	//����������� �� ��� ���� ������������
	if (i < Slider_slideUser.length) {
		slide.innerHTML = Slider_slideUser[i].innerHTML;
	}

	//��������� ���������� ������� - ����
	slide.addEventListener("click", function() {sliderTool_click(this.id);}, true);

	return slide;
}

/**
 * ������������� ��������� (������������) ��������� �������� � ������ ������ ����� ��������
 * 
 * ����� - �� function onLoadSlider()
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

		/*//BEGIN ������ "�������"*/
//		s += '\n['+i+'] ID: "' + slide.id + '"<br>\n';
//		s += 'left: "' + slide.style.left + '" ? "' + getComputedStyle(slide).left + '"<br>\n';
//		s += 'z-index: "' + slide.style.zIndex + '" ? "' + getComputedStyle(slide).zIndex + '"<br>\n';
//		s += 'width: "' + slide.style.width + '" ? "' + getComputedStyle(slide).width + '"<br>\n';
//		s += 'height: "' + slide.style.height + '" ? "' + getComputedStyle(slide).height + '"<br>\n';
//		slide.innerHTML += s;//������� ���������� ����
		//END ������ "�������"*/
		}
	}
}

/**
 * ������������� �������� ���������� ��������
 * 
 * ����� - �� function onLoadSlider()
 * �����!! - �������� �����-������ (�� ����� �������) ��� ������ ����� ������� (������ 10)
 * �����!!! ����. ��� ������������ ��������� ������� div ��������, ������� ������� �������� ������� �� ����� ���������. �� �� (1) ���������� � ��������� �� %, � ������� px. �� �� (2) �������� ��������� ������� ������������ �������� ����.
 */
function showSliderTool() {
	var wrapper = O(Slider_nameWrapper);

	//BEGIN ������/������������� ����� ������� ����������
	var tool = document.createElement('div');//������� div
	tool.className = Slider_nameTool;//����� ��� css-�����
	tool.id = Slider_nameTool;//����� ��� id

	var arroy = document.createElement('div');//������� div
	arroy.className = 'slider_toolArroyL';//����� ��� css-�����
	arroy.innerHTML = nameBtnLeft;//������� ����� � ������
	arroy.title = hintBtnLeft;
	/*��������� ���������� ������� - ����*/
	arroy.addEventListener("click", function() { sliderTool_click('left'); }, false);
	tool.appendChild(arroy);//��������� ������� "�����" � ������ DIV-� ��������� ���������� ��������

	var arroy = document.createElement('div');//������� div
	arroy.className = 'slider_toolArroyR';//����� ��� css-�����
	arroy.innerHTML = nameBtnRight;//������� ����� � ������
	arroy.title = hintBtnRight;
	/*��������� ���������� ������� - ����*/
	arroy.addEventListener("click", function() { sliderTool_click('right'); }, false);
	tool.appendChild(arroy);//��������� ������� "������" � ������ DIV-� ��������� ���������� ��������

	wrapper.appendChild(tool);//�������������: ������������ ���� ���� tool

	//BEGIN ������� margin-top �����!
	if (parseFloat(getComputedStyle(tool).marginTop) == 0) {
		//height wrapper-� ��� �������� �� CSS
		var heightWrapperSlider = getComputedStyle(wrapper).height;//[�����+px]
		//height ������ ���������� "�����"/"������" �� CSS
		var heightToolArrow = getComputedStyle(tool).height;//[�����+px]
		//����� "�����" ��������, ������� ���������
		if (move == "play") {//��� ���������� �������� ������� ������������ �� 1 ����� ������
			var lines = Slider_slideCountVisual + 1;
		} else {
			if (start) {
				var lines = Slider_slideCountVisual;
			} else {
				var lines = Slider_slideCountVisual + 1;
			}
		}
		//����������� ����������� "�����" � px = ������� margin-top ��������� ����������
		var tmp = parseInt(heightWrapperSlider) * (lines-1) + parseFloat(parseInt(heightWrapperSlider) / 2 + parseFloat(parseInt(heightToolArrow) / 2));
		tool.style.marginTop = - tmp + 'px';
	}
	//END ������� margin-top
	//END ������/������������� ����� ������� ����������
	
	/*//BEGIN ������ "�������"
	var s = 'function showSliderTool()\n';
	s += 'Margin-Top = ' + tool.style.marginTop
		+ '\nheightWrapperSlider = ' + heightWrapperSlider
		+ '\nheightToolArrow = ' + heightToolArrow
		+ '\nlines = ' + lines
		+ '\nSlider_slideCountVisual = ' + Slider_slideCountVisual;
//	alert(s);
	//END ������ "�������"*/
}

/**
 * ���������� �������: ���� ������������� �� ��������� ��������: ����� �����, ������ "�����" � "������"
 * �������������� ��������� ��������: �������������� ����������� (way: 'left' ��� 'right'), ����� (move: 'pause' ��� 'play') ��������; ��������� ���������� �������� (old_way, old_startIndx, old_sliders_work)
 * ��� ��������� ������ move=='play', ��� ������� �� ������ ������������ �������: function startMove()
 * 
 * @param {string} direct ����� ����������� ��������: "left" - ������ "�����"; "right" - ������ "������"; "slide_X" - ����� � ������� X, ��������� � id ������, � - ��������� � ��� � ������� slidersDIV
 * 
 */
function sliderTool_click(direct) {
	var s = 'function sliderTool_click()\n';//�������
	s	+= 'User press (direct) = ' + direct
		+ '\nold way = ' + way
		+ '\nold move = ' + move;//�������
	
	//����� ����������� ��������: ������ ����������� ��� ������� ������ "������"-"�����"
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
		+ '<br>move = ' + move;//�������

	//��� ������ "������-�����" ���������� ����� ������� ��� ����� �����
	if (move == "pause") {
		move = "play";

		/*BEGIN ���������� ������ - ���������*/
		if (start) {
			old_startIndx = sliders_workStartIndx;
			old_sliders_work = sliders_work.slice(0);
		} else {
			//�������������� ���������. ���� ��� ���������������� ������� ������ L-R
			initIndxs();
		}
		/*END ���������� ������ - ���������*/
	} else {
		move = "pause";
		
		//�������������� ���������. ���� ��� ���������������� ������� ������ L-R
		initIndxs();
		
		//��� ��������� ����� = ����� �������� ��������
		wSheet.innerHTML = '';
		for(var i = 0; i < sliders_work.length; i++) {
			sliders_work[i].style.animationName = '';//��� ��������
			sliders_work[i].style.animationDuration = 3 + 'ms';//����� ��������, ���
			sliders_work[i].style.animationDelay = 3 + 'ms';//����� �������� ����� ���������� ��������, ����
			sliders_work[i].style.animationIterationCount = 0;//����� ������������ ��������
		}
	}
	
	s1	+=  '<br>old_startIndx (New) = ' + old_startIndx//;
		+ '<br>startIndx (New) = ' + sliders_workStartIndx;
//	document.getElementById('statusBar').innerHTML = s1;//�������
	
	s	+= '\nold_startIndx = ' + old_startIndx
		+ '\nnew way = ' + way
		+ '\nnew move = ' + move;//�������;
//	alert(s);//�������

	if (move != "pause")//�������� ��������
	{
		startMove();
	}
}

/**
 * ��������� ��� ������ ����� ��������: ��� ��� ������� ������, ��� � ��� ����� �������: �������������� ���������� ��� ���������� ��������:
 * 1) ��������� ������: sliders_workStartIndx
 * 2) ������ ������� ������������ �������: sliders_work � ������� ������ ������� � ����������� �� ���������� ������: left = ������ ����� - ������� ������ � ������, ��������� ����� - ������� �������� �� �����; right = ������ �����, ������� ������ �� �����, ��������� - ������� ������. "������" - ������� ����� ���������, "���������" - ������� ������ ���������
 * 3) 
 * ����� - �� function sliderTool_click() � function nextSlide()
 * ��� ������� �� �������� �� ���������� ���������� �������� �����: function nextSlide() ��� Slider_OnlyOne != 1, ����� - ��������� �� �������� function notSlide()
 * 
 */
function startMove() {
	//BEGIN ��������� ������ sliders_work
	var s = 'function startMove()\n';//�������
	s	+= 'start = ' + start
		+ '\nstartIndx = ' + sliders_workStartIndx
		+ '\nway = ' + way
		+ '\nmove = ' + move
		+ '\n';//�������
	
	var s1 = '';
	s1	+= 'start = ' + start
		+ '<br>old_startIndx = ' + old_startIndx
		+ '<br>startIndx = ' + sliders_workStartIndx
		+ '<br>way = ' + way
		+ '<br>old_way = ' + old_way
		+ '<br>move = ' + move;//�������
//	document.getElementById('statusBar').innerHTML += '<hr>'+s1;//�������
	
	var wrapper = O(Slider_nameWrapper);
	if (((way == "right")&&(move == "play"))||((old_way == "right")&&(move == "pause"))) {
		//�������������� sliders_workStartIndx = ����� ������
		if (!start) {//������ ����� - �� ��������� �������� �����
			sliders_workStartIndx = old_startIndx - 1;
			if (sliders_workStartIndx < 0) {
				sliders_workStartIndx = slidersDIV.length-1;
			}
		} else {
			start = false;
		}
		
		//�������������� sliders_work
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
		//�������������� �������: ������� �������� � sliders_work, ���������� k = sliders_workStartIndx + i + 1;
		k = sliders_workStartIndx-1;
		s += '; [kMIN]='+k;
		if (k < 0)
			k = slidersDIV.length - 1;
		s += '=>' + k;
		s += '; ' + slidersDIV[k].id + '\n';
		sliders_work.unshift(slidersDIV[k]);
	}
	if (((way == "left")&&(move == "play"))||((old_way == "left")&&(move == "pause"))) {
		//�������������� sliders_workStartIndx = ����� ������
		if (!start) {//������ ����� - �� ��������� �������� �����
			sliders_workStartIndx = old_startIndx + 1;
			if (sliders_workStartIndx > slidersDIV.length-1)
				sliders_workStartIndx = 0;
		} else {
			start = false;
		}
		
		//�������������� sliders_work
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
		//�������������� �������: last �������� � sliders_work, ���������� k = sliders_workStartIndx + i + 1;
		k = k + 1;
//		s += '; [kMAX]='+k;
		if (k > slidersDIV.length-1)
			k = k - slidersDIV.length;
//		s += '=>'+k;
//		s += '; '+slidersDIV[k].id+'\n';
		sliders_work.push(slidersDIV[k]);
	}
	//END ��������� ������ sliders_work

	//BEGIN ������������� ��������� ���� ��������
	clearWrapper();//�������� ���������� ��������
	
	//������������� ������� ��������� ��������� ��������
	//width ������ ������
	var wdth = slideWidth();
//	var wdth = parseFloat((100 / Slider_slideCountVisual).toFixed(2)) + '%';//� %
	var wdth_px = slideWidth_Px;//� px
//	var wdth_px = (parseFloat(getComputedStyle(wrapper).width) * parseFloat(wdth) / 100).toFixed(2) + 'px';//� px
	var keyfr = '';//���������� - ��������� css-������ ��� ������� �������� (������� � DOM CSS)
	var s5 = 'function startMove()\n';//�������
	for (var i = 0; i < sliders_work.length; i++) {
		//������������� width (������� ������-��...)
//		sliders_work[i].style.width = wdth;
		s5 += '\n[' + i + '] width = "' + sliders_work[i].style.width + '"; "' + wdth_px + '"\n';
		sliders_work[i].style.width = wdth_px;
		//������������� top (� ������ ����� ��������� ������������ ������� (sliders_work) - ���������������� top ������� ������ � ����������� �� ������� ������� [i] � ��������� sliders_work)
		sliders_work[i].style.top = '-' + (i * (parseFloat(getComputedStyle(wrapper).height)) - i*2) + 'px';
//		sliders_work[i].style.top = '0px';

		//������-�� �� ����� �������� sliders_work[i].style.animation - ��� ���������� animationName
		//standart; Moz=Firefox, Webkit=Crome, Opera, Safari, O=Opera
		sliders_work[i].style.animationName = 'move_' + i;//��� ��������
		sliders_work[i].style.animationDuration = Slider_Time + 'ms';//����� ��������, ���
		sliders_work[i].style.animationTimingFunction = animationTimingFunction;//��������� ������� ��������
		sliders_work[i].style.animationDelay = Slider_TimeWait + 'ms';//����� �������� ����� ���������� ��������, ����
		sliders_work[i].style.animationIterationCount = 1;//����� ������������ ��������
		sliders_work[i].style.animationFillMode = 'forwards';//��������� ������� ����� �������� - Not support Safari
		
		//������������� left (� ������ ����� ��������� ������������ ������� (sliders_work) - ���������������� top ������� ������ � ����������� �� ������� ������� [i] � ��������� sliders_work)
		if (way == "right") {//�������������� �������: ������� �������� � sliders_work
			sliders_work[i].style.left = (i * (parseFloat(wdth_px)) - parseFloat(wdth_px)).toFixed(2) + 'px';
//			sliders_work[i].style.left = '0px';;
			
			//��������� ������ ��������
			keyfr += '@keyframes move_' + i + ' {\n';//��� �������� [move_id]
			keyfr += '0%   { left: ' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + 'px; }\n';//������� �������� left
			keyfr += '100% { left: ' + (parseFloat(sliders_work[i].style.left) + parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//����� �������� left;
			s5 += 'left = "' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + '" => "' + (parseFloat(sliders_work[i].style.left) + parseFloat(wdth_px)).toFixed(2) + '"\n';
		}
		if (way == "left") {//�������������� �������: last �������� � sliders_work
			sliders_work[i].style.left = (i * (parseFloat(wdth_px))).toFixed(2) + 'px';

			//��������� ������ ��������
			keyfr += '@keyframes move_' + i + ' {\n';//��� �������� [id_move]
			keyfr += '0%   { left: ' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + 'px; }\n';//������� �������� left
			keyfr += '100% { left: ' + (parseFloat(sliders_work[i].style.left) - parseFloat(wdth_px)).toFixed(2) + 'px; }\n}\n';//����� �������� left;
			s5 += 'left = "' + (parseFloat(sliders_work[i].style.left)).toFixed(2) + '" => "' + (parseFloat(sliders_work[i].style.left) - parseFloat(wdth_px)).toFixed(2) + '"\n';
		}

		var s1 = '';//�������
		s1 += '['+i+'] = '+sliders_work[i].id+'<br>';
		s1 += 'Top: "' + sliders_work[i].style.top + '" ? "' + getComputedStyle(sliders_work[i]).top + '"<br>';
		s1 += 'Left: "' + sliders_work[i].style.left + '" ? "' + getComputedStyle(sliders_work[i]).left + '"<br>';
		s1 += 'z-index: "' + sliders_work[i].style.zIndex + '" ? "' + getComputedStyle(sliders_work[i]).zIndex + '"<br>';
		s1 += 'width: "' + sliders_work[i].style.width + '" ? "' + getComputedStyle(sliders_work[i]).width + '"<br>';
		s1 += 'height: "' + sliders_work[i].style.height + '" ? "' + getComputedStyle(sliders_work[i]).height + '"<br>';
		if ((way == "right")&&(i == 0)) {
		//�������������� �������: ������� �������� � sliders_work
//			sliders_work[i].style.left = '-' + wdth_px;
			s1 += 'additional<br>';
		}
		if ((way == "left")&&(i == sliders_work.length-1)) {
		//�������������� �������: last �������� � sliders_work
//			sliders_work[i].style.left = i * parseFloat(getComputedStyle(sliders_work[i-1]).width) + 'px';
//			sliders_work[i].style.top = '-' + getComputedStyle(sliders_work[i-1]).height;
			s1 += 'additional<br>';
		}
//		sliders_work[i].innerHTML = s1;//�������

		wrapper.appendChild(sliders_work[i]);//��������� ������� ����� � DOM-������������� ������������ ��������� 

		s += '\n';//�������
		s += '[' + i + '] = "' + sliders_work[i].id + '"\n';//�������
		s += 'Top: "' + sliders_work[i].style.top + '" ? "' + getComputedStyle(sliders_work[i]).top + '"\n';
		s += 'Left: "' + sliders_work[i].style.left + '" ? "' + getComputedStyle(sliders_work[i]).left + '"\n';
		s += 'z-index: "' + sliders_work[i].style.zIndex + '" ? "' + getComputedStyle(sliders_work[i]).zIndex + '"\n';
		s += 'width: "' + sliders_work[i].style.width + '" ? "' + getComputedStyle(sliders_work[i]).width + '"\n';
		s += 'height: "' + sliders_work[i].style.height + '" ? "' + getComputedStyle(sliders_work[i]).height + '"\n';
	}
//	alert(s5);
	
	//������������� ������ ����������, ���� ���� ��������
	if (Slider_Manual == 1) {
		showSliderTool(wrapper);
	}

//	alert(s);//�������
//	alert(s + '\n' + keyfr);//�������
	//END ������������� ��������� ���� ��������
	
	//��������� "��������"
	if (move == "play") {
//		css_edit(keyfr);//������ ����� ��� style � ��������� � ���� keyfr
		wSheet = css_edit(keyfr);//������ ����� ��� style � ��������� � ���� keyfr
		if (Slider_OnlyOne != 1) {
			setTimeout(nextSlide, Slider_TimeWait+Slider_Time);//��������� �� ���������� ��������
		} else {
			setTimeout(notSlide, Slider_TimeWait+Slider_Time);//��������� �� ���������� ��������
		}
	}
}

/**
 * ��������� ����� ��� style � head ���������, ���� � ���������� styles
 * 
 * ����� - �� function startMove()
 * ���������� ���������� � function startMove()
 * @param {string} styles ��������� ������ ����������� css-������
 * @return {document.styleSheet} ������ �� styleSheet (�������� ���������), � ������� ��������
 */
function css_edit(styles) {
	var s = 'function css_edit()\n';//�������

	//����� �� ������� ����� styleSheet � ������ ������ ���������
	styleElt = wSheet;
	if (styleElt === null) {
		s += 'styleElt === null\n';
		var styleElt = document.createElement("style");//����� node style
		document.head.appendChild(styleElt);
		ss = document.styleSheets[document.styleSheets.length-1];
	}
	
	//��������� styles
	if (styleElt.innerHTML != styles) {
	//������ innerHTML, ���� �� �� ��������� � ����� - ����� �������� styleSheets
		styleElt.innerHTML = styles;
	} else {//����� �������� ������ ���� ������ ���
		styleElt.disabled = true;
		styleElt.disabled = false;
	}
	
	s += 'document.styleSheets.length = ' + document.styleSheets.length + '\n';
	s += 'styles = [\n' + styles + ']\n';
//	alert(s);//�������
	
	return styleElt;//����� �� ������� ���� ������ �� node ������� styleSheet
}

/**
 * ��� move == "play", ��� ���������� �������� ��������� ����� - ������ ���������� � ����������
 * 
 * ����� - �� �������� �� function startMove()
 * ������� ���������� � function startMove()
 */
function notSlide() {
	var s = 'function notSlide()\n\n';
	old_way = way;//
	move = "pause";
	
	//�������������� old_startIndx, sliders_workStartIndx
	old_startIndx = sliders_workStartIndx;
	if (way == "right") {
		//�������������� sliders_workStartIndx = ����� ������
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
 * ��� move == "play", ��� ���������� �������� ��������� ����� - ������ ���������� � ����������
 * 
 * ����� - �� �������� �� function startMove()
 * ������� ���������� � function startMove()
 */
function nextSlide() {
	var s = 'function nextSlide()\n\n';
	old_way = way;//

	//�������������� old_startIndx, sliders_workStartIndx
	old_startIndx = sliders_workStartIndx;
	//��������!!! ������-�� ��� Right �� ��������� ������������� �������������� sliders_workStartIndx???
	if (way == "right") {
		//�������������� sliders_workStartIndx = ����� ������
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

	startMove();//����� �����
}

/**
 * �������������� sliders_workStartIndx � old_startIndx ��� �������� �������� left-right
 * 
 * ��������� ������ ����� ��������������� ���������� old_way � way
 * ����� - �� function sliderTool_click()
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
	
	//BEGIN �������������� ���������
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
	//END �������������� ���������
}