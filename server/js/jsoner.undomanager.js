/**
 * Copyright (c) 2007, Softamis, http://soft-amis.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
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
 * @fileoverview
 * <p>
 * The module contains UndoManager implementaion.
 * </p>
 * <p>
 * UndoManager is a recorder of undo and redo operations.
 * UndoManager allows users to correct their mistakes and also to try out
 * different aspects of the application without risk of repercussions.
 * Undo-redo mechanism provides such abilities as:
 * <ul>
 *  <li>Un-execute (undo) the last action they just performed
 *  <li>Re-execute (redo) the last undone action
 * </ul>
 * </p>
 * <p>
 * Proposed implementation of UndoManager provides multi-level undo support.
 * Atomic elements of UndoManager are UndoableActions,
 * which contains a logic how to do something and how to get back to the starting point.
 * The UndoManager records commands on a stack.
 * When the user undoes a command, the UndoManager pops it from the stack,
 * revealing the previously executed command. Once a user has undone at least one command,
 * executing any new command clears the undo stack.
 * If you choose, you can also force the UndoManager to provide predefined level of undo support,
 * where it remembers only predefined count of commands.
 * </p>
 * <p>
 * UndoManager usage case is very easier:
 * <ul>
 * <li>Two ways to record UndoableAction to UndoManager:
 *   <ul>
 *    <li>Calls undoable Action (or not calls - we are not controls it) and adds it to undo stack.
 *    <code>undoManager.addAction(anAction)</code>.
 *    <li>Adds undoable Action to UndoManager undo stack and automatically calls DO method of the action.
 *    If it was successfully adds the action to undo stack, otherwise - calls DO error processing.
 *    <code>undoManager.callDo(anAction)</code>
 *   </ul>
 * <li>To invoke undo operation <code>callUndo()</code>.
 * <li>To invoke redo operation <code>callRedo()</code>.
 * </ul>
 * </p>
 * One of the strong feuteres of Undo manager is customizable error processing
 * which allows to Undo Manager be fault tolerant or fault restore in accordance
 * with particular logic.
 * <p>
 * As stated above, Undo manager records undoable Actions.
 * Undoable Action is such kind of action, which is not only aware of how to do something,
 * but also how to get back to the starting point.
 * Undoable action consists of two unfold operations: DO and UNDO.
 * Proposed implementation of undoable Action wraps two JavaScript methods, one of
 * them represents DO operation, another - UNDO operation and allows
 * define corresponding parameters to invoke them.
 * </p>
 *
 * The code is part of JSONER library.
 * JSONER can be downloaded free from
 * <a href="http://sourceforge.net/projects/jsontools"> http://sourceforge.net/projects/jsontools </a>.
 * Here anyone can leave his comments and wishes.
 * Please submit bugs to the SourceForge bug tracker, and feature ideas/patches to the email
 * <a href="mailto:jsoner@soft-amis.com">jsoner@soft-amis.com</a>, and we’ll get on it.
 *
 * @author Alexey Luchkovsky.
 */

/**
 * Class identifier.
 * @private
 */
var UNDO_MANAGER =
{
	version: 1.24
};

/**
 * Creates undoable Action, such kind of action, which is not only
 * aware of how to do something, but also how to get back to the starting point.
 * Undoable action consists of two unfold operations: DO and UNDO.
 * Proposed implementation of undoable Action wraps two JavaScript methods, one of
 * them represents DO operation, another - UNDO operation
 * but really undoable Action is an interface and can be implemented
 * corresponding to particular logic.
 *
 * @constructor
 * @param {Function} The undoable Action DO method.
 * @param {Function} The undoable Action UNDO method.
 * @param {Array} The array of parameters of DO method.
 * @param {Array} The array of parameters of UNDO method.

 * @param {String} The undoable Action presentation.
 * @param {String} The undoable Action group.
 */
function UndoableAction(aDoMethod, aUndoMethod, aDoParams, aUndoParams, aName, aGroup)
{
	this.fStatus = undefined;
	this.fName = COMMONS.isString(aName) ? aName : undefined;
	this.fGroup = aGroup;

	this.fDoMethod = aDoMethod;
	this.fUndoMethod = aUndoMethod || aDoMethod;
	this.fDoParams = COMMONS.isUndefined(aDoParams) || COMMONS.isArray(aDoParams) ? aDoParams : [aDoParams];
	this.fUndoParams = COMMONS.isUndefined(aUndoParams) || COMMONS.isArray(aUndoParams) ? aUndoParams : [aUndoParams];
}

/**
 * Creates undoable Action logger.
 */
UndoableAction.prototype.fLogger = new Logger("UndoableAction")

/**
 * The value designates that do method of undoable Action
 * was called successfully.
 */
UndoableAction.STATUS_DO_OK = 1;

/**
 * The value designates that do method of undoable Action
 * was called not successfully (same errors occurred).
 */
UndoableAction.STATUS_DO_ERROR = 1000;

/**
 * The value designates that undo method of undoable Action
 * was called successfully.
 */
UndoableAction.STATUS_UNDO_OK = 2;

/**
 * The value designates that undo method of undoable Action was called
 * not successfully (same errors occurred).
 */
UndoableAction.STATUS_UNDO_ERROR = 1001;

/**
 * Returns undoable Action group.
 * Usually action group represents action type and used to group similar actions.
 *
 * @return {String} Returns undoable Action group.
 */
UndoableAction.prototype.getGroup = function()
{
	return this.fGroup;
};

/**
 * Returns undoable Action name.
 * Usually action name used to create undoable Action presentation.
 * @return {String} Returns undoable Action name.
 *
 * @param {Boolean} The true designates that "DO"  presentation requested, false - "UNDO".
 */
UndoableAction.prototype.getName = function(anUndo)
{
	return this.fName;
};

/**
 * Returns undoable Action status.
 * The undoable Action status designates result of calling action.
 * If the action never was called, action status is undefined.
 * It value used by undo manager to select logic after action calling.
 *
 * @return {Integer} Returns undoable Action status.
 */
UndoableAction.prototype.getStatus = function()
{
	return this.fStatus;
};

/**
 * Calls undoable Action DO method.
 */
UndoableAction.prototype.callDo = function()
{
	if (COMMONS.isFunction(this.fDoMethod))
	{
		try
		{
			if (COMMONS.isArray(this.fDoParams))
			{
				this.fDoMethod.apply(this, this.fDoParams);
			}
			else
			{
				this.fDoMethod.call(this);
			}
			this.fStatus = UndoableAction.STATUS_DO_OK;
		}
		catch(ex)
		{
			this.fStatus = UndoableAction.STATUS_DO_ERROR;
			this.fLogger.error("doAction, error happened", ex, this.fDoMethod);
		}
	}
};

/**
 * Calls undoable Action UNDO method.
 */
UndoableAction.prototype.callUndo = function()
{
	if (COMMONS.isFunction(this.fUndoMethod))
	{
		try
		{
			if (COMMONS.isArray(this.fUndoParams))
			{
				this.fUndoMethod.apply(this, this.fUndoParams);
			}
			else
			{
				this.fUndoMethod.call(this);
			}
			this.fStatus = UndoableAction.STATUS_UNDO_OK;
		}
		catch(ex)
		{
			this.fStatus = UndoableAction.STATUS_UNDO_ERROR;
			this.fLogger.error("undoAction, error happened", ex, this.fUndoMethod);
		}
	}
};

/**
 * Indicates that the action is reversible.
 * Limitation: cross links in parameters are not supported.
 * 
 * @return {Boolean} If so it returns true, otherwise it returns false.
 */
UndoableAction.prototype.isReversible = function()
{
	var result = this.fDoMethod === this.fUndoMethod && COMMONS.isEquals(this.fDoParams, this.fUndoParams);
	return result;
};

/**
 * Merges given action with the current action.
 *
 * @param {UndoableAction} The undoable action which should be merged with current action.
 * @return {Boolean} Returns true if merge operation accessible, otherwise - false.
 */
UndoableAction.prototype.merge = function(aUndoableAction)
{
	var result = false;
	if (aUndoableAction instanceof UndoableAction)
	{
		if (COMMONS.isDefined(this.fGroup) && this.fGroup === aUndoableAction.getGroup() &&
		    COMMONS.isDefined(this.fDoParams))
		{
			if (this.fDoMethod === aUndoableAction.fDoMethod && this.fUndoMethod === aUndoableAction.fUndoMethod)
			{
				this.fDoParams = aUndoableAction.fDoParams;
				result = true;
			}
		}
	}
	else
	{
		this.fLogger.error("merge, illegal agrument type:" + aUndoableAction);
	}
	return result;
};

/********************************************************************/

/**
 * Creates an UndoManager.
 * UndoManager is a recorder of undo and redo operations.
 * UndoManager allows users to correct their mistakes and also to try out
 * different aspects of the application without risk of repercussions.
 * Undo-redo mechanism provides such abilities as:
 * <ul>
 *  <li>Un-execute (undo) the last action they just performed
 *  <li>Re-execute (redo) the last undone action
 * </ul>
 *
 * Proposed implementation of UndoManager provides multi-level undo support.
 * Atomic elements of UndoManager are UndoableActions,
 * which contains a logic how to do something and how to get back to the starting point.
 * The UndoManager records commands on a stack.
 * When the user undoes a command, the UndoManager pops it from the stack,
 * revealing the previously executed command. Once a user has undone at least one command,
 * executing any new command clears the undo stack.
 * If you choose, you can also force the UndoManager to provide predefined level of undo support,
 * where it remembers only predefined count of commands.
 *
 * UndoManager usage case is very easier:
 * <ul>
 * <li>Two ways to record UndoableAction to UndoManager:
 *   <ul>
 *    <li>Calls undoable Action (or not calls - we are not controls it) and adds it to undo stack.
 *    <code>undoManager.addAction(anAction)</code>
 *    <li>Adds undoable Action to UndoManager undo stack and automatically calls DO method of the action.
 *    If it was successfully adds the action to undo stack, otherwise - calls DO error processing.
 *    <code>undoManager.callDo(anAction)</code>
 *   </ul>
 * <li>To invoke undo operation <code>callUndo()</code>.
 * <li>To invoke redo operation <code>callRedo()</code>.
 * </ul>
 *
 * @constructor
 *
 * @param {Integer} Defines UndoManager stack size.
 */
function UndoManager(aMaxSize)
{
	this.fMaxSize = COMMONS.isNumber(aMaxSize) ? aMaxSize : 32;
	this.fUndoData = [];
	this.fRedoData = [];
}

/**
 * Creates UndoManager logger.
 */
UndoManager.prototype.fLogger = new Logger("UndoManager");

/**
 * Returns UndoManager undo stack.
 * @return {Array} Returns UndoManager undo stack.
 */
UndoManager.prototype.getUndoStack = function()
{
	return this.fUndoData;
};

/**
 * Indicates that UndoManager undo stack is not empty.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 */
UndoManager.prototype.isUndoFound = function()
{
	var stack = this.getUndoStack();
	return stack.length > 0;
};

/**
 * Returns UndoManager redo stack.
 * @return {Array} Returns UndoManager redo stack.
 */
UndoManager.prototype.getRedoStack = function()
{
	return this.fRedoData;
};

/**
 * Indicates that UndoManager redo stack is not empty.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 */
UndoManager.prototype.isRedoFound = function()
{
	var stack = this.getRedoStack();
	return stack.length > 0;
};

/**
 * Calls undoable Action and if it was successfully adds it to undo stack,
 * otherwise - calls undo manager DO error processing.
 *
 * @params {UndoableAction} The undoable Action.
 * @params {String} The undoable Action ID.
 *
 * @see #addAction
 * @see #processErrorDo
 */
UndoManager.prototype.callDo = function(anUndoableAction, aID)
{
	if (anUndoableAction instanceof UndoableAction)
	{
		try
		{
			anUndoableAction.callDo();
			if (anUndoableAction.getStatus() === UndoableAction.STATUS_DO_OK)
			{
				this.addAction(anUndoableAction, aID);
			}
			else
			{
				this.processErrorDo(anUndoableAction)
			}
		}
		catch(ex)
		{
			this.processErrorDo(anUndoableAction, ex)
		}
	}
	else
	{
		this.fLogger.info("callDo, illegal argument:" + anUndoableAction);
	}
};

/**
 * Adds undoable Action to undo stack.
 *
 * @params {UndoableAction} The undoable Action.
 * @params {String} The undoable Action ID.
 *
 * @see #callDo
 */
UndoManager.prototype.addAction = function(anUndoableAction, aID)
{
	if (anUndoableAction instanceof UndoableAction)
	{
		var add = true;
		if (this.isUndoFound())
		{
			var lastAction = this.fUndoData[this.fUndoData.length - 1].action;
			add = !lastAction.merge(anUndoableAction);
			if ( !add && lastAction.isReversible() )
			{
				this.fUndoData.length--;
			}
		}

		if (add)
		{
			if (!COMMONS.isDefined(anUndoableAction.fLogger))
			{
				anUndoableAction.fLogger = this.fLogger;
			}
			var data = {id:aID, action:anUndoableAction};
			var stack = this.getUndoStack();
			if (stack.length < this.fMaxSize)
			{
				stack.push(data);
			}
			else
			{
				stack.shift(data);
			}

			if ( this.isRedoFound() )
			{
				var lastAction = this.fRedoData[this.fRedoData.length - 1].action;
				if ( !COMMONS.isEquals(anUndoableAction, lastAction) )
				{
					this.fRedoData.length = 0;
				}
			}
		}
	}
	else
	{
		this.fLogger.info("addAction, illegal argument:" + anUndoableAction);
	}
};

/**
 * Calls undo operation if it is available.
 * Gets last action from undo stack and calls action UNDO method.
 * If it was successfully adds action to redo stack,
 * otherwise - calls undo manager UNDO error processing.
 */
UndoManager.prototype.callUndo = function()
{
	if (this.isUndoFound())
	{
		var data = this.getUndoStack().pop();
		if (COMMONS.isObject(data))
		{
			var undoableAction = data.action;
			try
			{
				undoableAction.callUndo();
				if (undoableAction.getStatus() === UndoableAction.STATUS_UNDO_OK)
				{
					var stack = this.getRedoStack();
					if (stack.length < this.fMaxSize)
					{
						stack.push(data);
					}
					else
					{
						stack.shift(data);
					}
				}
				else
				{
					this.processErrorUndo(data);
				}
			}
			catch(ex)
			{
				this.processErrorUndo(data, ex);
			}
		}
	}
	else
	{
		this.fLogger.info("callUndo, undo stack is empty");
	}
};

/**
 * Calls redo operation if it is available.
 * Gets last action from redo stack and calls action DO method.
 * If it was successfully adds action to undo stack,
 * otherwise - calls undo manager DO error processing.
 */
UndoManager.prototype.callRedo = function()
{
	if (this.isRedoFound())
	{
		var data = this.getRedoStack().pop();
		if (COMMONS.isObject(data))
		{
			var action = data.action;
			try
			{
				action.callDo();
				if (action.getStatus() === UndoableAction.STATUS_DO_OK)
				{
					var stack = this.getUndoStack();
					if (stack.length < this.fMaxSize)
					{
						stack.push(data);
					}
					else
					{
						stack.shift(data);
					}
				}
				else
				{
					this.processErrorDo(action)
				}
			}
			catch(ex)
			{
				this.processErrorDo(data, ex)
			}
		}
	}
	else
	{
		this.fLogger.info("callRedo, redo stack is empty");
	}
};

/**
 * UNDO error processing.
 * Customizable error processing allows to Undo Manager be fault tolerant 
 * or fault restore component in accordance with particular logic.
 *
 * @params {UndoableAction} The undoable Action.
 * @params {Exception} The occured exception.
 */
UndoManager.prototype.processErrorUndo = function(aUndoableAction, anException)
{
};

/**
 * DO error processing.
 * Customizable error processing allows to Undo Manager be fault tolerant
 * or fault restore component in accordance with particular logic.
 *
 * @params {UndoableAction} The undoable Action.
 * @params {Exception} The occured exception.
 */
UndoManager.prototype.processErrorDo = function(aUndoableAction, anException)
{
};

/**
 * Clears the undo manager.
 * Removes all actions from undo manager.
 */
UndoManager.prototype.clear = function()
{
	this.getUndoStack().length = 0;
	this.getRedoStack().length = 0;
};
