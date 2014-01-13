function setProperty(object, keys, value) {
	var runner = object;
	for(var i=0, max=keys.length-1; i<max; ++i) {
	   runner[keys[i]] = runner[keys[i]] || {};
	   runner = runner[keys[i]];
	}
	runner[keys[keys.length-1]] = value;   
}

(function(){

	var 
	
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver,

	addTags = function(tagStructure, parentElement) {
		var targetContainer = parentElement ? parentElement : tagContainer;

		for (i in tagStructure) {
			item = tagStructure[i];
			
			if (item.hasOwnProperty('className')) {
				li = document.createElement('li');
				li.setAttribute('class', item.className);

				a = document.createElement('a');
				a.setAttribute('class', item.aClassName);
				a.setAttribute('title', item.aTitle);

				div = document.createElement('div');
				div.setAttribute('class', item.aClassName);
				div.innerHTML = item.divInnerHTML.split(' - ').pop();

				a.appendChild(div);
				li.appendChild(a);
				targetContainer.appendChild(li);
			} else {
				li = document.createElement('li');
				li.style.padding = '0.25em 3em 0 1em';

				div = document.createElement('div');
				div.setAttribute('class', 'P_NAVPANEL_SUBMENU_ITEM');

				icon = document.createElement('div');
				icon.setAttribute('class', 'P_NAVPANEL_ZIPPY_ICON');

				textdiv = document.createElement('div');
				textdiv.setAttribute('class', 'P_NAVPANEL_SUBMENU_NAME');

				text = document.createTextNode(i);

				ul = document.createElement('div');
				ul.setAttribute('class', 'P_NAVPANEL_SUBMENU_ITEM');
				ul.style.padding = '0.25em 0 0 0.5em';

				textdiv.appendChild(icon);
				textdiv.appendChild(text);

				div.appendChild(textdiv)

				li.appendChild(div);
				li.appendChild(ul);

				targetContainer.appendChild(li);

				addTags(tagStructure[i], ul);
			}
		}
	},

	hasMutated = function(mutations, observer){
		var loaded = document.querySelector('.ID-tm-block'),
			hasClass = document.querySelector('.ID-tm-block.GTM-FOLDERS'),
			elementData = [[], [], []], elementDataLength,
			structureData = [{},{},{}],
			tags, conditions, macros, blockList, blockListLength, element, elementList, elementListLength, a, div;

		if(loaded && !hasClass) {
			blockList = [
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-tags-block li'),
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-conditions-block li'),
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-macros-block li')
			];

			tagTarget = '.ID-tm-tags-block';
			conditionTarget = '.ID-tm-conditions-block';
			macroTarget = '.ID-tm-macros-block';

			tagContainer = document.querySelector(tagTarget);
			conditionContainer = document.querySelector(conditionTarget);
			macroContainer = document.querySelector(macroTarget);

			tagContainer.innerHTML = "";
			conditionContainer.innerHTML = "";
			macroContainer.innerHTML = "";

			blockListLength = blockList.length;
			while(--blockListLength >= 0) {
				elementList = blockList[blockListLength];
				elementListLength = elementList.length;
				while(--elementListLength >= 0) {
					element = elementList[elementListLength];
					a = element.getElementsByTagName('a')[0];
					div = element.getElementsByTagName('div')[0];
					elementData[blockListLength].push({
						'className' : element.className,
						'aClassName' : a.className,
						'aTitle' : a.title,
						'divClassName' : div.className,
						'divInnerHTML' : div.innerHTML
					});
				}
			}

			for (i in elementData) {
				elementData[i].sort(function (a, b) {
				  return a.length - b.length;
				});
			}

			for (i=0; i<=2; i++) {
				tags = elementData[i];
				tagsLength = tags.length;
				while(--tagsLength >= 0) {
					runner = tags[tagsLength];
					treePositionData = runner.divInnerHTML.split(' - ');
					setProperty(structureData[i], treePositionData, runner);
				}
			}

			addTags(structureData[0], tagContainer);
			addTags(structureData[1], conditionContainer);
			addTags(structureData[2], macroContainer);

			loaded.className += ' GTM-FOLDERS';
		}
	},

	observer = new MutationObserver(hasMutated);

	observer.observe(document, {
		subtree: true,
		attributes: true
	});
}());