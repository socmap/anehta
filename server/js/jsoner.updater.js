/**
 * Copyright (c) 2007, Softamis, http://soft-amis.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Alexey Luchkovsky
 * E-mail: jsoner@soft-amis.com
 *
 * Version: 1.24
 * Last modified: 06/06/2007
 */

/**
 * Class identifier.
 * @private
 */
var UPDATER =
{
	version: 1.24
};

/**
 * @fileoverview
 * <p>
 * The module contains periodicaly Executor and Updatable Action Manager implementaion.
 * </p>
 * <p>
 * Executor represents a simple facility
 * for periodical execution of a process with a appointed interval
 * between each calls fixed times.
 * Executor allows to join several process in one chain or create
 * tree structured process chaining.
 * Executor provides a mechanism that prevent parallel executions of
 * the processes which are tooks longer than the defined interval to execute.
 * Executor allows to specify callback function that will be invoked when
 * process have been finished.
 * </p>
 * <p>
 * Main purpose of Updatable Action Manager is creation of
 * loosely coupled action-based architecture.
 * </p>
 * <p>
 * Updatable Action Manager represents a action manager which
 * is a keyboard event listener on the one side and
 * periodical process with a appointed interval on the other side.
 * Periodical process is used to update actions status and related HTML components
 * by particular logic.
 * Keyboard event listener allowes to connect hot keys with actions and "magic word" with
 * switch actions ON.
 * Action invocation API simplify definion of particular action logic
 * because action status checker  carries out on separate level.
 * Usualy the same logic is used to check action pre-conditions and
 * caller DOM node status (enabled-disabled).
 * Additionaly, updatable action manager helps to create
 * action repeated invocation functionality as a result of a long mouse event.
 *
 * Main features of upadatable action manager are:
 * <ul>
 *  <li> Chains action with HTML component/components to change their UI according to action status.
 *  For example, enable - disable the component or highlight on validation error or
 *  particular business logic the component.
 *  <li>Simplify defintion of component event listener because action
 *  preconditions are  carried out on separate level and automaticaly called
 *  before action invocation.
 *  <li> Invokes action by hot key.
 *  <li> Switch ON - OFF actions by "magic word".
 *  <li> Updatable action manager helps to create action repeated invocation
 *  functionality as a result of long mouse event.
 * </ul>
 * </p>
 */

var UpdaterDOMUtils = {}

UpdaterDOMUtils.ELEMENT_NODE  = 1;
UpdaterDOMUtils.TEXT_NODE     = 3;
UpdaterDOMUtils.DOCUMENT_NODE = 9;

UpdaterDOMUtils.getElement = function(anElement)
{
	var result = COMMONS.isString(anElement) ? document.getElementById(anElement) : anElement;
	return result;
};

UpdaterDOMUtils.getDocument = function(anElement)
{
	var result = anElement;
	if ( anElement.nodeType !== this.DOCUMENT_NODE )
	{
	  result = anElement.ownerDocument;
	}
	return result;
};

UpdaterDOMUtils.addEventListener = function(anObject, aEventName, aCallback)
{
	var element = this.getElement(anObject);
	if (element )
	{
		if (COMMONS.isIE)
		{
			element.attachEvent("on" + aEventName, aCallback);
		}
		else
		{
			element.addEventListener(aEventName, aCallback, true);
		}
	}
};

UpdaterDOMUtils.removeEventListener = function(anObject, aEventName, aCallback)
{
	var element = this.getElement(anObject);
	if (element )
	{
		if (COMMONS.isIE)
		{
			element.detachEvent("on" + aEventName, aCallback);
		}
		else
		{
			element.removeEventListener(aEventName, aCallback, true);
		}
	}
};

UpdaterDOMUtils.getEventTarget = function(anEvent)
{
	var result = anEvent.srcElement || anEvent.target;
	if (result && result.nodeType === this.TEXT_NODE )
	{
    result = result.parentNode;
	}
	return result;
};

UpdaterDOMUtils.getEventKeyCode = function(anEvent)
{
	var result = anEvent.keyCode || anEvent.charCode;
	return result;
};

/**
 * Executor represents a simple facility
 * for periodical execution of a process with a appointed interval
 * between each calls.
 * Executor allows to join several process in one chain or create
 * tree structured process chaining.
 * Executor provides a mechanism that prevents parallel executions of
 * the processes which  take longer than the defined interval to execute.
 * Executor allows to specify callback function that will be invoked when
 * process have been finished.
 * @constuctor
 *
 * @param {Function} The process.
 * @param {Integer} The appointed interval between each calls of given process.
 * @param {Integer} The counter.
 * @param {Function} The callback function on executor process finished.
 * @param {Boolean} The flag, defines that mechanism that prevenst parallel executions which
 * should be active.
 */
function Executor(aProcess, aTimeout, aCounter, aOnStop, aWait)
{
  this.fOnStop = aOnStop;
	this.fProcess = aProcess;
	this.fWait = aWait;
	this.fLock = false;
	this.fCounter = isNaN(aCounter) ? 1000000 : aCounter;
	this.fTimeout = isNaN(aTimeout) ? 500 : aTimeout;
	this.fLockCheckerTimeout = Math.round(this.fTimeout()/4);
	this.fOwnExecutor = null;

	this.fJoinedExecutors = [];
	this.fLogger = new Logger("Executor");

	this.fTaskID = null;
	this.fLockCheckerTaskID = null;
}

/**
 * Indicates that the executed process is locked or any
 * of chained process is locked.
 * The method can be overrided to be corresponding to the particular logic.
 * For example, thread is locked as long as chained threads are  alive.
 *
 * @return {Boolean} Returns true is it so, otherwise - false.
 */
Executor.prototype.isLocked = function()
{
	var result = this.fTaskID && this.fLock;
	if ( !result )
	{
		var executor;
		for( var i = 0; i < this.fJoinedExecutors.length; i++)
		{
			executor = this.fJoinedExecutors[i];
			if ( executor.isLocked() )
			{
				result = true;
				break;
			}
		}
	}
	return result;
};

/**
 * Indicates that the executor is alive.
 * @return {Boolean} Returns true is it so, otherwise - false.
 */
Executor.prototype.isAlive = function()
{
	return this.fCounter > 0;
};

/**
 * Invokes the executor callback on process finished.
 */
Executor.prototype.onStopCallBack = function()
{
	if ( COMMONS.isFunction(this.fOnStop) )
	{
		try
		{
			this.fOnStop.call(this);
		}
		catch(ex)
		{
			this.fLogger.error("Executor onStop error caused", ex );
		}
	}
};

/**
 * Starts an executor thread.
 */
Executor.prototype.start = function()
{
	this.fLock = false;
	this.doStart();
};

/**
 * Periodicaly invokes the  process until
 * the executor counter is more the zerro.
 * @private
 */
Executor.prototype.doStart = function()
{
	var executor = this;

	if (this.fLockCheckerTaskID !== null )
	{
		window.clearTimeout(this.fLockCheckerTaskID);
		this.fLockCheckerTaskID = null;
	}
	if ( this.isLocked() )
	{
		this.fLockCheckerTaskID = window.setTimeout(function()
		{
			executor.doStart();
		}, this.fLockCheckerTimeout );
	}
	else
	{
		if (this.fTaskID !== null)
	  {
		  window.clearTimeout(this.fTaskID);
		  this.fTaskID = null;
	  }
		if ( this.isAlive() )
		{
			if ( COMMONS.isFunction(this.fProcess) )
			{
				if ( this.fWait)
				{
					this.fLock = true;
				}
				try
				{
					this.fProcess.call(this);
				}
				catch(ex)
				{
					this.fLogger.error("Executor process error caused", ex );
				}
				this.fLock = false;
			}
			this.fCounter--;

			this.fTaskID = window.setTimeout(function()
			{
				executor.doStart()
			}, this.fTimeout );
		}
		else
		{
			this.onStopCallBack();
		}
  }
};

/**
 * Sets the flag that the executor should  stop executing
 * of current process and all chained threads too.
 */
Executor.prototype.stop = function()
{
	this.fCounter = -1;

	var executor;
	for( var i = 0; i < this.fJoinedExecutors.length; i++)
	{
		executor = this.fJoinedExecutors[i];
		if ( executor.isAlive() )
		{
			try
			{
				executor.stop();
			}
			catch(ex)
			{
				this.fLogger.error("Unable to stop an executor because an error occured", ex);
			}
		}
	}
};

/**
 * Forces the executor to stop executing of current process
 * and all chained threads too.
 */
Executor.prototype.fireStop = function()
{
	var executor;
	for( var i = 0; i < this.fJoinedExecutors.length; i++)
	{
		executor = this.fJoinedExecutors[i];
		try
		{
		  executor.fireStop();
		}
		catch(ex)
		{
			this.fLogger.error("Unable to stop an executor because an error occured", ex);
		}
	}

	if (this.fLockCheckerTaskID !== null )
	{
		window.clearTimeout(this.fLockCheckerTaskID);
		this.fLockCheckerTaskID = null;
	}
	if (this.fTaskID !== null)
	{
		window.clearTimeout(this.fTaskID);
		this.fTaskID = null;
	}
	this.onStopCallBack();
	this.fCounter = -1;
};

/**
 * Adds another executor to current for chaining them.
 * Added executor has information about its owner.
 *
 * @see #isLocked
 */
Executor.prototype.chain = function(anExecutor)
{
	if ( anExecutor instanceof Executor )
	{
		anExecutor.fOwnExecutor = this;
	  this.fJoinedExecutors.push(anExecutor);
	}
	else
	{
		this.fLogger.error("joinProcess, illegal argument type: " + anExecutor);
	}
};

/**
 * Creates updatable action manager.
 * Main purpose of upadatable action manager is creation of
 * loosely coupled action- based architecture.
 *
 * Updatable action manager represents a action manager which
 * is a keyboard event listener on the one side and
 * periodical process with a appointed interval on the other side.
 *
 * Periodical process is used to update actions status and related HTML components
 * by particular logic.
 * Keyboard event listener allowes to connect hot keys with actions and "magic word" with
 * switch actions ON.
 * Action invocation API simplify definion of particular action logic
 * because action status checker is carried out on separate level.
 * Usualy the same logic is used to check action pre-conditions and
 * caller DOM node status (enabled-disabled).
 * Additionaly, updatable action manager helps to create
 * action repeated invocation functionality on long mouse event.
 *
 * Main features of upadatable action manager are:
 * <ul>
 *  <li> Chains action with HTML component/components to change their UI
 *  according to the action status.
 *  For example, enable - disable the component, highlight the component.
 *  <li>Simplify defintion of component event listener because action
 *  preconditions are carried out on separate level and automaticaly called
 *  before action invocation.
 *  <li> Invokes action by hot key.
 *  <li> Switch ON - OFF actions by magic word.
 *  <li> Updatable action manager helps to create action repeated invocation
 *  functionality on long mouse event.
 * </ul>
 * @constructor
 *
 * @param {Integer} An interval for periodical update process (in ms).
 * @param {Node} The monitored container, document by default.
 */
function Updater(aTimeout, aContainer)
{
  this.fActions = [];
	this.fUIProcessors = new HashMap();
  this.fKeys = new HashMap();

	this.fKeyBuffer = "";
	this.fKeyBufferSize = -1;

  this.fLock = false;
	this.fCheckWord = false;
	this.fCheckKey = false;

	this.fProcessID = null;
	this.fAutoRepeatTaskID = null;

	this.fTimeout = isNaN(aTimeout) ? 50 : aTimeout;
	this.fLogger = new Logger("Updater");

	this.fContainer = COMMONS.isObject(aContainer) || document;

  this.initKeyMaps();
	this.initUIProcessors();
}

Updater.KB_BSP    = 8;
Updater.KB_TAB    = 9;
Updater.KB_CENTER = 12;
Updater.KB_ENTER  = 13;
Updater.KB_CTRL   = 17;
Updater.KB_CAPS   = 20;
Updater.KB_ESC    = 27;
Updater.KB_PAGE_UP   = 33;
Updater.KB_PAGE_DOWN = 34;
Updater.KB_END   = 35;
Updater.KB_HOME  = 36;
Updater.KB_LEFT  = 37;
Updater.KB_UP    = 38;
Updater.KB_RIGHT = 39;
Updater.KB_DOWN  = 40;
Updater.KB_DEL   = 46;
Updater.KB_PLUS  = 107;
Updater.KB_MINUS = 109;
Updater.KB_PLUS_KB  = 61;
Updater.KB_MINUS_KB = 189;

/**
 * Registers key map to simplify description of of action key chain.
 * @param {String} The string that defines key code in
 * the description of action key chain.
 * @param {Integer} The key code.
 */
Updater.prototype.registerKeyMap = function(aName, aCode)
{
  this.fKeys.put(aName, aCode);
};

/**
 * Registers default key map to simplify
 * description of actions key chains.
 */
Updater.prototype.initKeyMaps = function()
{
  this.registerKeyMap("LEFT", Updater.KB_LEFT);
  this.registerKeyMap("UP", Updater.KB_UP);
  this.registerKeyMap("RIGHT", Updater.KB_RIGHT);
  this.registerKeyMap("DOWN", Updater.KB_DOWN);
  this.registerKeyMap("PAGE_UP", Updater.KB_PAGE_UP);
  this.registerKeyMap("PAGE_DOWN", Updater.KB_PAGE_DOWN);

  this.registerKeyMap("PLUS", Updater.KB_PLUS);
  this.registerKeyMap("PLUSKB", Updater.KB_PLUS_KB);
  this.registerKeyMap("MINUS", Updater.KB_MINUS);
  this.registerKeyMap("MINUSKB", Updater.KB_MINUS_KB);

  this.registerKeyMap("TAB", Updater.KB_TAB);
  this.registerKeyMap("CENTER", Updater.KB_CENTER);
  this.registerKeyMap("ENTER", Updater.KB_ENTER);
  this.registerKeyMap("ESC", Updater.KB_ESC);
};

/**
 * Registers UI processor by DOM node name.
 * UI processor represents a function which available change component UI
 * under corresponding action status.
 * Interface of component UI processor is:
 * <code>function(aNode, aStatus)</code>
 *
 * @param {String} The DOM node name.
 * @param {Function} The UI processor.
 */
Updater.prototype.registerUIProcessor = function(aNodeName, aFunction)
{
  this.fUIProcessors.put(aNodeName, aFunction);
};

/**
 * Registers UI processors by defaults.
 * @see #registerUIProcessor
 */
Updater.prototype.initUIProcessors = function()
{
	this.registerUIProcessor("IMG", this.updateImageUI );
	this.registerUIProcessor("BUTTON", this.updateControlUI );
	this.registerUIProcessor("INPUT", this.updateControlUI );

	this.registerUIProcessor("A", this.updateBlockUI );
	this.registerUIProcessor("TD", this.updateBlockUI );
	this.registerUIProcessor("DIV", this.updateBlockUI );
};

/**
 * Returns UI processor suitable to DOM node and
 * required action status.
 *
 * @return {Function} Returns UI processor
 * suitable to DOM node and required status.
 * @param {Node} The DOM node.
 * @param The action status.
 */
Updater.prototype.getUIProcessor = function(aNode, aStatus)
{
	var result = undefined;
	if ( COMMONS.isObject(aNode) && aNode.nodeType === UpdaterDOMUtils.ELEMENT_NODE )
	{
		result = this.fUIProcessors.get(aNode.nodeName);
	}
	return result;
};

/**
 * Parses string which  destignates the set of action hot keys to
 * array of array of keystrokes.
 *
 * Hot keys definition examples:
 * <code>Ctrl-Shift-P</code>
 * <code>Alt-PAGE_UP Alt-Shift-PAGE_UP</code>
 * <code>CTRL-SHIFT-124 SHIFT-ALT-M</code>
 *
 * @param {String} The string which is destignated
 * the set of action hot keys.
 * @return {Array} Returns prepared array of array of keystrokes.
 * For example: [[ALT, 33], [ALT, SHIFT, 33]]
 */
Updater.prototype.parseHotKey = function(aHotKey)
{
	var result = undefined;
	var code;
	if ( COMMONS.isString(aHotKey) )
	{
		result = aHotKey.split(' ');
		for (var i = 0; i < result.length; i++ )
		{
			result[i] = result[i].split('-');
			code = this.fKeys.get( result[i][result[i].length - 1] );
			if ( code !== undefined )
			{
				result[i][result[i].length - 1] = code;
			}
			else
			{
				result[i][result[i].length - 1] = result[i][result[i].length - 1].toUpperCase();
			}
			if ( result[i].length > 1)
			{
				var modifier;
				for (var j = 0; j < result[i].length - 1; j++ )
				{
					result[i][j] = result[i][j].toUpperCase();
				}
			}
		}
	}
  return result;
};

/**
 * Indicates that the array of array of keystrokes  matches with
 * given keyboard event.
 *
 * @return {Boolean} Returns true is it so, otherwise - false.
 * @param {Array} The array of array of keystrokes.
 * For example: [[ALT, M], [ALT, SHIFT, L]]
 *
 * @param {Event} The keyborad event.
 */
Updater.prototype.isMatchedKey = function(aKeyStroke, aEvent)
{
	var keyCode = UpdaterDOMUtils.getEventKeyCode(aEvent);

	var result = false;
	var keyStroke;
	for (var i = 0; i < aKeyStroke.length; i++)
	{
		keyStroke = aKeyStroke[i];
		if ( COMMONS.isNumber(keyStroke[keyStroke.length - 1]) )
		{
			result = keyCode === parseInt(keyStroke[keyStroke.length - 1]);
		}
		else
		{
			result = String.fromCharCode(keyCode) === keyStroke[keyStroke.length - 1];
		}

		if ( result && keyStroke.length > 1)
		{
			for (var j = 0; j < keyStroke.length - 1; j++)
			{
				if ((keyStroke[j] === "SHIFT" && !aEvent.shiftKey) ||  (keyStroke[j] === "CTRL" && !aEvent.ctrlKey) ||
				    (keyStroke[j] === "ALT" && !aEvent.altKey))
				{
					result = false;
					break;
				}
			}
		}
	}
	return result;
};

/**
 * Starts updatable action manager.
 * @see #stop
 */
Updater.prototype.start = function()
{
	this.stop();
	var updater = this;

	this.fProcessID = window.setInterval(function()
	{
		updater.update()
	}, this.fTimeout);

	if ( this.keyup === undefined )
	{
		this.keyup = function(event)
		{
			if ( updater.acceptKeyEvent(event) )
			{
				updater.keyPressed(event);
			}
		};
		UpdaterDOMUtils.addEventListener(this.fContainer, "keyup", this.keyup);
	}
	if ( this.mouseup === undefined )
	{
		this.mouseup = function (event)
		{
			updater.mouseUp(event)
		};
		UpdaterDOMUtils.addEventListener(this.fContainer, "mouseup", this.mouseup);
	}
};

/**
 * Stops updatable action manager.
 * @see #destroy
 */
Updater.prototype.stop = function()
{
	if (this.fProcessID !== null)
	{
		window.clearInterval(this.fProcessID);
		this.fProcessID = null;
	}
};

/**
 * Stops updatable action manager, destroys
 * registered listeners and clears registered actions array.
 *
 * @see #stop
 */
Updater.prototype.destroy = function()
{
	this.stop();
	if ( this.mouseup !== undefined )
	{
		UpdaterDOMUtils.removeEventListener(this.fContainer, "mouseup", this.mouseup);
		this.mouseup = undefined;
	}
	if ( this.keyup !== undefined )
	{
		UpdaterDOMUtils.removeEventListener(this.fContainer, "mouseover", this.keyup);
		this.keyup = undefined;
	}
	this.fActions = [];
};

/**
 * Updatable action factory.
 * Creates updatable action by given parameters.
 *
 * Result action status is false and the action
 * is switched OFF by defaults.
 *
 * @param {String} The action ID.
 * @param {Function} The action body - the method is  invocated by action.
 * @param {Function} The action status checker - the method which returns the action status.
 * @param {Array} The array of chained with action HTML components ID.
 * @param {Array} The action hot keys.
 * @param {Integer} The action timeout - interval is ms to invoke action automaticaly.
 * @param {String} The "magic word" which is used to switch ON the action (if it is necessary).
 */
Updater.prototype.createAction = function(aID, anAction, aStatusChecker, anElementsID, aHotKey, aAutoTimeout, aMagicWord )
{
	var result =
	{
		id:aID,
		on:false,
		status:false,
		action:COMMONS.isFunction(anAction) ? anAction : undefined,
	  checker:COMMONS.isFunction(aStatusChecker) ? aStatusChecker : undefined,
	  elements: COMMONS.isArray(anElementsID) ? anElementsID : (COMMONS.isString(anElementsID) ? [anElementsID] : undefined),
	  autoTimeout: isNaN(aAutoTimeout) ? 0 : aAutoTimeout,
		key: COMMONS.isString(aHotKey) ?  this.parseHotKey(aHotKey) : undefined,
		word: COMMONS.isString(aMagicWord) ? aMagicWord.toUpperCase() : undefined
	};
	return result;
}

/**
 * Creates updatable action by given parameters and adds its to the action manager.
 *
 * @param {String} The action ID.
 * @param {Function} The action body - the method is invoked by action.
 * @param {Function} The action status checker - the method which returns the action status.
 * @param {Array} The array of chained with action HTML components ID.
 * @param {Array} The action hot keys.
 * @param {Integer} The action timeout - interval is ms to invoke action automaticaly.
 * @param {String} The magic word which used to switch on the action (if it necessary).
 */
Updater.prototype.addAction = function(aID, anAction, aStatusChecker, anElementsID, aHotKey, aAutoTimeout, aMagicWord )
{
	var action = this.createAction(aID, anAction, aStatusChecker, anElementsID, aHotKey, aMagicWord, aAutoTimeout);

	this.fCheckKey = action !== undefined;
	if ( action.word !== undefined  )
	{
		this.fCheckWord = true;
		this.fKeyBufferSize = Math.max(this.fKeyBufferSize, action.word.length);
	}
	var index = this.fActions.length;
	for(var i = 0; i < index; i++)
  {
		if ( this.fActions[i].id === action.id )
		{
			index = i;
			break;
		}
	}
  this.fActions[index] = action;
};

/**
 * Returns the updatable action by given ID.
 * If corresponding action can't be obtained it returns undefined.
 *
 * @param {String} The action ID.
 * @return The updatable action.
 */
Updater.prototype.getAction = function(aID)
{
	var result = undefined;
	for(var i = 0; i < this.fActions.length; i++)
	{
		if (this.fActions[i].id === aID )
		{
			result = this.fActions[i];
			break;
		}
	}
	return result;
};

/**
 * Indicates that the keyboard event is accepted.
 *
 * @param {Event} The key up event.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 */
Updater.prototype.acceptKeyEvent = function(aEvent)
{
	var result = false;
	var element = UpdaterDOMUtils.getEventTarget(aEvent);
	if ( COMMONS.isObject(element) )
	{
		result = true;
	  if (element.nodeName === "TEXTAREA" || element.nodeName === "INPUT" ||
	      element.nodeName === "SELECT" || element.nodeName === "BUTTON")
	  {
		  result = COMMONS.toBoolean(element.readOnly) || COMMONS.toBoolean(element.disabled);
	  }
  }
	return result;
};

/**
 * Switches actions to ON/OFF.
 * Actions that are not switched in ON status are ignored.
 *
 * @param The Order of actions ID.
 * <code> switchAction("action1", "action2",..., true);</code>
 * @param {Boolean} The actions switch status.
 */
Updater.prototype.switchAction = function(aID, anON)
{
	for(var i = 0; i < arguments.length - 1; i++)
	{
		var action = this.getAction(arguments[i]);
		if ( COMMONS.isObject(action) )
		{
			action.on = arguments[ arguments.length - 1 ];
		}
	}
};

/**
 * Indicates that the action should be processed.
 *
 * @return {Boolean} Returns true if the given action is switched ON
 * and action status is true, otherwise - returns false.
 * @param The updatable action.
 */
Updater.prototype.acceptAction = function(anAction)
{
	var result = COMMONS.isObject(anAction) && anAction.on && anAction.status;
	return result;
};

/**
 * Action manager keyboard listener.
 * Tries to find an action by key code and
 * if the corresponding action is available invoke its.
 *
 * @param {Event} The keyboard event.
 */
Updater.prototype.keyPressed = function(event)
{
	var result = null;
	var action;

  if (this.fAutoRepeatTaskID !== null)
	{
		window.clearTimeout(this.fAutoRepeatTaskID);
		this.fAutoRepeatTaskID = null;
	}

  if ( !this.fLock && (this.fCheckWord || this.fCheckKey) )
  {
    var keyCode = UpdaterDOMUtils.getEventKeyCode(event);
	  if ( this.fCheckWord )
	  {
		  if (this.fKeyBuffer.length >= this.fKeyBufferSize)
		  {
				this.fKeyBuffer = this.fKeyBuffer.substring(1, this.fKeyBuffer.length);
			}
		  this.fKeyBuffer += String.fromCharCode(keyCode);
			for(var i = 0; i < this.fActions.length; i++)
			{
				action = this.fActions[i];
				if ( !action.on && (this.fKeyBuffer === action.word) )
				{
					action.on = true;
				}
			}
	  }

	  if ( this.fCheckKey )
	  {
			for(var i = 0; i < this.fActions.length; i++)
			{
				action = this.fActions[i];
				if ( this.acceptAction(action) && action.key !== undefined )
				{
					if ( this.isMatchedKey(action.key, event) )
					{
						this.fLock = true;
						try
						{
							result = action.action.call(this, event);
						}
						catch(ex)
						{
							this.fLogger.error("keyPressed, call of the action " + action.id +" an error caused", ex);
						}

					  var updater = this;
						window.setTimeout(function()
						{
							updater.fLock = false
						}, 10);
						break;
					}
				}
			}
		}
  }
	return result;
};

/**
 * Periodically updates actions status and related HTML components.
 * @see #getUIProcessor
 */
Updater.prototype.update = function()
{
	var getStatus = function(anAction)
	{
		var result = true;
		if ( COMMONS.isFunction(anAction.checker) )
		{
			result = false;
			try
			{
				result = anAction.checker.call(this);
			}
			catch(ex)
			{
				this.fLogger.warning("update, call of action check method an error caused", ex);
			}
		}
		return result;
	};

	if ( !this.fLock )
	{
		var action;
		var element;
		var processor;
		for (var i = 0; i < this.fActions.length; i++)
		{
			action = this.fActions[i];
			if ( action.on )
			{
				action.status = getStatus.call(this, action);
				if ( COMMONS.isArray(action.elements) )
				{
					for(var j = 0; j < action.elements.length; j++)
					{
						element = UpdaterDOMUtils.getElement(action.elements[j]);
						processor = this.getUIProcessor(element, action.status);
						if ( COMMONS.isFunction(processor) )
						{
							processor.call(this, element, action.status);
						}
					}
				}
			}
		}
	}
};

/**
 * Indicates that the HTML node UI should be updated.
 *
 * @param {Node} The DOM node.
 * @param The action status.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 */
Updater.prototype.acceptUpdateUI = function(aNode, aStatus)
{
	return aNode.status !== aStatus;
};

/**
 * DOM node UI processor by defaults.
 * Note: The method can be overrided by custom particular logic.
 *
 * In case of disabled node class name ends with "Off" and
 * enabled node class name ends with "On",  class name will be changed
 * according to the action status.
 * For example:
 * <ul>
 *  <li> Status is true - the class name is "blockOn".
 *  <li> Status is false - the class name is "blockOff".
 * </ul>
 *
 * @param {Node} The DOM node.
 * @param {Boolean} The action status.
 * @param {Boolean} Returns true if node class name is changed successfully,
 * otherwise - false.
 */
Updater.prototype.updateClassName = function(aNode, aStatus)
{
	var result = false;
	var className = aNode.className;
	if (COMMONS.isString(className) && /Off\b|On\b/.test(className))
	{
		var newValue = (aStatus) ? className.replace(/Off\b/, "On") : className.replace(/On\b/, "Off");
		if (className !== newValue)
		{
			aNode.className = newValue;
			result = true;
		}
	}
	return result;
};

/**
 * Updates image UI to be according to the action status:
 * <ul>
 *  <li> In case of the image class name conformed by predefined rules image
 *  class will be changed.
 *  For example:
 *  <ul>
 *   <li> Status is true - the class name is "imageOn".
 *   <li> Status is false - the class name is "imageOff".
 *  </ul>
 *  <li> Otherwise, if the disabled image src ends with "Off" and
 *  enabled image src ends with  "On" image src will be changed
 *  according to the action status.
 *  For example:
 *   <ul>
 *    <li> Status is true - the image src is "imgOn.gif".
 *    <li> Status is false - the image src is "imgOff.gif".
 *  < /ul>
 * </ul>
 *
 * @param {Node} The IMG node.
 * @param {Boolean} The action status.
 *
 * @see #updateClassName
 */
Updater.prototype.updateImageUI = function(anImage, aStatus)
{
	if ( this.acceptUpdateUI(anImage, aStatus) )
	{
		if ( !this.updateClassName(anImage, aStatus) )
		{
			var src = anImage.src;
			if (COMMONS.isString(src) && /Off\b|On\b/.test(src) )
			{
				var newValue = (aStatus) ? src.replace(/Off\b/, "On") : src.replace(/On\b/, "Off");
				if ( src !== newValue )
				{
					anImage.src = newValue;
				}
			}
		}
		anImage.status = aStatus;
	}
};

/**
 * Updates form control UI corresponding with the action status:
 * <ul>
 *  <li> In case of the control class name conformed by the
 *  predefined rules control class will be changed.
 *  For example:
 *  <ul>
 *   <li> Status is true - the class name is "inputOn".
 *   <li> Status is false - the class name is "inputOff".
 *  </ul>
 *  <li> Otherwise, the control will be disabled or enabled
 *  according to the action status.
 * </ul>
 *
 * @param {Node} The form control node.
 * @param {Boolean} The action status.
 * @see #updateClassName
 */
Updater.prototype.updateControlUI = function(aControl, aStatus)
{
	if ( this.acceptUpdateUI(aControl, aStatus) )
	{
		if ( !this.updateClassName(aControl, aStatus) )
		{
			if ( aStatus )
			{
				aControl.disabled = undefined;
				aControl.removeAttribute("disabled");
			}
			else
			{
				aControl.disabled = true;
			}
    }
		aControl.status = aStatus;
	}
};

/**
 * Updates block control UI and all block children
 * according to the action status:
 *
 * <ul>
 *  <li> In case of the block class name is conformed by the
 *  predefined rules block class will be changed.
 *  For example:
 *  <ul>
 *   <li> Status is true - the class name is "divOn".
 *   <li> Status is false - the class name is "divOff".
 *  </ul>
 *  <li> In case of the block background image is defined
 *  and clip attribute is defined, block backgound clipping will be changed.
 * </ul>
 *
 * @param {Node} The block node.
 * @param {Boolean} The action status.
 * @see #updateClassName
 */
Updater.prototype.updateBlockUI = function(aBlock, aStatus)
{
	if ( this.acceptUpdateUI(aBlock, aStatus) )
	{
		if ( !this.updateClassName(aBlock, aStatus) )
		{
			var clip = aBlock.clip;
			if ( COMMONS.isDefined(clip) )
			{
				clip = COMMONS.toInteger(clip) * 2;
				aBlock.style.backgroundPosition = aStatus ? ("-" + clip + "px 0") : ("0 0");
			}
		}
		aBlock.status = aStatus;

    var processor;
		var children = aBlock.childNodes;
		for( var i = 0; i < aBlock.childNodes.length; i++ )
		{
			processor = this.getUIProcessor( children[i], aStatus);
			if ( COMMONS.isFunction(processor) )
			{
				processor.call(this, children[i], aStatus);
			}
		}
  }
};

/**
 * Updatable action manager mouse up listener.
 * If autorepeat functionality on long mouse click is active
 * stops window process.
 *
 * @param {Event} The mouse up event.
 */
Updater.prototype.mouseUp = function(event)
{
	if (this.fAutoRepeatTaskID !== null)
	{
    window.clearTimeout(this.fAutoRepeatTaskID);
    this.fAutoRepeatTaskID = null;
  }
};

/**
 * Forces to call action by action ID.
 *
 * Uses mousedown event listener to autorepeat functionality activation.
 * Note: action autorepeat timeout should be greater than one.
 * 
 * Example of definition:
 * <div onmousedown="manager.call('id')"></div>
 */
Updater.prototype.call = function(aID)
{
	var doInvoke = function(anAction)
	{
		var updater = this;
		if (this.fAutoRepeatTaskID !== null)
		{
			window.clearTimeout(this.fAutoRepeatTaskID);
			this.fAutoRepeatTaskID = null;
		}

		if ( this.fLock  )
		{
			this.fAutoRepeatTaskID = window.setTimeout(function()
			{
				doInvoke.call(updater, anAction);
			}, anAction.autoTimeout);
		}
		else
		if ( this.acceptAction(anAction) )
		{
			this.fLock = true;
			try
			{
				anAction.call(this);
				if ( this.acceptAction(anAction) )
				{
					this.fAutoRepeatTaskID = window.setTimeout(function()
					{
						doInvoke.call(updater, anAction);
					}, anAction.autoTimeout);
				}
			}
			catch(ex)
			{
				this.fLogger.error("doInvoke, action " + this.fAction.id + " invocation error caused", ex);
			}
			this.fLock = false;
		}
	};

	if (this.fAutoRepeatTaskID !== null)
	{
		window.clearTimeout(this.fAutoRepeatTaskID);
		this.fAutoRepeatTaskID = null;
	}

	if ( !this.fLock )
	{
		var action = this.getAction(aID);
		if (  this.acceptAction(action) )
		{
			this.fLock = true;
			var updater = this;

			try
			{
				action.action.call(this);
				if ( action.autoTimeout > 1 && this.acceptAction(action) )
				{
					this.fAutoRepeatTaskID = window.setTimeout(function()
					{
						doInvoke.call(updater, action);
					}, action.autoTimeout);
				}
			}
			catch(ex)
			{
				this.fLogger.error("invoke, action " + action.id +  "invocation error caused", ex);
			}
			this.fLock = false;
		}
	}
};