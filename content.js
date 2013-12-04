function setProperty(object, keys, value) {
	var runner = object;
	for(var i=0, max=keys.length-1; i<max; ++i) {
	   runner[keys[i]] = runner[keys[i]] || {};
	   runner = runner[keys[i]];
	}
	runner[keys[keys.length-1]] = value;   
}

(function(){
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var observer = new MutationObserver(function(mutations, observer) {
		var loaded = document.querySelector('.ID-tm-block'),
			hasClass = document.querySelector('.ID-tm-block.GTM-FOLDERS'),
			elementData = [[], [], []], elementDataLength,
			tagStructure = {}, conditionStructure = {}, macroStructure = {},
			tags, conditions, macros, all, allLength, element, elementList, elementListLength, a, div;

		if(loaded && !hasClass) {
			all = [
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-tags-block li'),
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-conditions-block li'),
				document.querySelectorAll('.P_NAVPANEL_SUBMENU .ID-tm-macros-block li')
			];

			allLength = all.length;
			while(--allLength >= 0) {
				elementList = all[allLength];
				elementListLength = elementList.length;
				while(--elementListLength >= 0) {
					element = elementList[elementListLength];
					a = element.getElementsByTagName('a')[0];
					div = element.getElementsByTagName('div')[0];
					elementData[allLength].push({
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

			tags = elementData[0];
			tagsLength = tags.length;
			while(--tagsLength >= 0) {
				runner = tags[tagsLength];
				treePositionData = runner.divInnerHTML.split(' - ');
				setProperty(tagStructure, treePositionData, runner);
			}

			conditions = elementData[1];
			conditionsLength = conditions.length;
			while(--conditionsLength >= 0) {
				runner = conditions[conditionsLength];
				treePositionData = runner.divInnerHTML.split(' - ');
				setProperty(conditionStructure, treePositionData, runner);
			}

			macros = elementData[2];
			macrosLength = macros.length;
			while(--macrosLength >= 0) {
				runner = macros[macrosLength];
				treePositionData = runner.divInnerHTML.split(' - ');
				setProperty(macroStructure, treePositionData, runner);
			}

			tagTarget = '.ID-tm-tags-block';
			conditionTarget = '.ID-tm-conditions-block';
			macroTarget = '.ID-tm-macros-block';

			tagContainer = document.querySelector(tagTarget);
			conditionContainer = document.querySelector(conditionTarget);
			macroContainer = document.querySelector(macroTarget);

			tagContainer.innerHTML = "";
			conditionContainer.innerHTML = "";
			macroContainer.innerHTML = "";

			function addTags(tagStructure, parentElement) {
				for (i in tagStructure) {
					item = tagStructure[i];
					targetContainer = parentElement ? parentElement : tagContainer;
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
						li.setAttribute('class', 'ITEM_GROUP');
						li.style.padding = '0.25em 3em 0 1em';

						text = document.createTextNode(i);

						ul = document.createElement('ul');
						ul.setAttribute('class', 'ITEM_GROUP');
						ul.style.padding = '0.25em 0 0 0.5em';

						li.appendChild(text);
						li.appendChild(ul);

						li.addEventListener("click", function(e){
							if (this.classList.contains('hidden')) {
								this.className = this.className.replace(/\b(?:\s+)?hidden(?:\s+)?\b/,'');
							} else {
								this.className += ' hidden';
							}
							e.stopPropagation();
						}, false);

						targetContainer.appendChild(li);

						addTags(tagStructure[i], ul);
					}
				}
			}

			addTags(tagStructure, tagContainer);
			addTags(conditionStructure, conditionContainer);
			addTags(macroStructure, macroContainer);

			loaded.className += ' GTM-FOLDERS';
		}
	});

	// define what element should be observed by the observer
	// and what types of mutations trigger the callback
	observer.observe(document, {
		subtree: true,
		attributes: true
	});
}());