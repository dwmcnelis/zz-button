// addon/components/zz-button.js

import Ember from 'ember';

// A smart button with styling, icons and async support for Ember.js
//
// @module components
// @class  zz-button
//

export default Ember.Component.extend({

  //--------------------------------------------------------------------------------
  // Dependencies

  //--------------------------------------------------------------------------------
  // Attributes

  // The root component element
  //
  // @property {Ember.String} tagName
  // @default  "button"
  //
  tagName: 'button',

  // Bind the specified properties as DOM attributes.
  // @property attributeBindings
  // @private
  //
  attributeBindings: ['disabled', 'state', 'type'],

  // Class names to apply to the button
  //
  // @property {Ember.Array} classNames
  //
  classNames: ['zz-button', 'btn'],

  // Bind the specified properties as the classes of the DOM element.
  //
  classNameBindings: ['themeClass', 'sizeClass'],

  // True if the button is enabled and can be clicked.
  // @property enabled
  // @public
  //
  enabled: true,


  // The state of the button, can be one of the following:
  // default - The button is enabled and ready to be clicked.
  // pending - The promise bound to the button was sent and the promise is still pending
  // fulfilled - The promise was fulfilled properly.
  // rejected - The promise bound to the button was finished as rejected.
  //
  // The state is also bound to the DOM as `state` property, this allows to easily change styles for every
  // state by using `.em-button[state=fulfilled]` syntax.
  //
  // The label of the button will change to the value of the component properties that correspond to the
  // states mentioned above.
  //
  // @property state
  // @private
  //
  state: 'default',

  //--------------------------------------------------------------------------------
  // Actions

  // The action name to invoke on the controller when the button is clicked.
  // @property on-click
  // @public
  //
  'on-click': void 0,

  //--------------------------------------------------------------------------------
  // Events

  //--------------------------------------------------------------------------------
  // Properties

  // The size of the button
  //
  // @property {string} size
  // @default  "medium"
  //
  size: 'medium',

  // The bootstrap "theme" name
  //
  // @property {Ember.String} theme
  // @default  "default"
  // @public
  //
  theme: 'default',

  // The bootstrap "theme" name
  //
  // @property {Ember.String} theme
  // @default  "default"
  // @public
  //
  icon: null,

  // The valid states of button state.
  //
  // @property validStates
  // @private
  //
  states: ['default','pending','fulfilled','rejected'],

  // True if the button is not enabled or is in state 'pending'.
  // @property disabled
  // @public
  //
  disabled: (function() {
    return !this.get('enabled') || this.get('state') === 'pending';
  }).property('enabled', 'state'),

  // Set by the `onClick` callback, if set, the promise will be observed and the button's state will be
  // changed accordingly.
  // @property promise
  // @private
  //
  promise: void 0,

  //--------------------------------------------------------------------------------
  // Observers

  //--------------------------------------------------------------------------------
  // Methods

  // Converted theme string to Bootstrap button class
  //
  // @function themeClass
  // @observes theme
  // @returns  {Ember.String} Defaults to "btn-default"
  //
  themeClass: function() {
    return 'btn-' + this.get('theme');
  }.property('theme'),

  // Converted size string to Bootstrap button class
  //
  // @function sizeClass
  // @observes size
  // @returns  {Ember.String} Defaults to undefined
  //
  sizeClass: function() {
    var size = this.get('size');
    var sizeClass;

    switch (size) {
      case 'tiny':
        sizeClass = 'btn-xs';
        break;
      case 'small':
        sizeClass = 'btn-sm';
        break;
      case 'medium':
        sizeClass = null;
        break;
      case 'large':
        sizeClass = 'btn-lg';
        break;
      default:
        sizeClass = null;
        break;
    }

    return sizeClass;
  }.property('size'),

  // Converted icon string to Bootstrap button class
  //
  // @function iconClass
  // @observes state, icon, icon-pending, icon-fulfilled, icon-rejected
  // @returns  {Ember.String} Defaults to undefined
  //
  iconClass: (function() {
    var propName = (~this.states.shift().indexOf(this.state) ? "icon-" + this.state : 'icon');
    return this.getWithDefault(propName, this.get('icon'));
  }).property('state', 'icon', 'icon-pending', 'icon-fulfilled', 'icon-rejected','states'),


  // The label of the button, calculated according to the state of the button
  // See the `state` property documentation for more info.
  //
  // @function labelContent
  // @observes state, label, label-pending, label-fulfilled, label-rejected
  // @public
  //
  labelContent: (function() {
    var propName = (~this.states.shift().indexOf(this.state) ? "label-" + this.state : 'label');
    return this.getWithDefault(propName, this.get('label'));
  }).property('state', 'label', 'label-pending', 'label-fulfilled', 'label-rejected','states'),

  // Triggered when the button is clicked
  // Invoke the action name on the controller defined in the `action` property, default is `onClick`.
  // The action on the controller recieves a property that should be set to the promise being invoked (if there is one)
  // If a promise was set, the button will move to 'pending' state until the promise will be fulfilled
  //
  // @function onClick
  // @private
  //
  onClick: (function() {
    this.sendAction('on-click', (function(_this) {
      return function(promise) {
        _this.set('promise', promise);
        return _this.set('state', 'pending');
      };
    })(this));
    return false;
  }).on('click'),

  // Observes the promise property
  //
  // @function changeStateByPromise
  // @observes promise
  // @private
  //
  changeStateByPromise: (function() {
    return this.get('promise').then((function(_this) {
      return function() {
        return _this.set('state', 'fulfilled');
      };
    })(this), (function(_this) {
      return function(err) {
        _this.set('state', 'rejected');
        return _this.set('error', err);
      };
    })(this));
  }).observes('promise')

});
