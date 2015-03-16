// addon/components/zz_button.js

import Ember from 'ember';

// A smart button with styling, icons and async support for Ember.js
//
// @module components
// @class  zz-button
//

export default Ember.Component.extend({

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
  attributeBindings: ['disabled', 'status', 'type'],

  // Class names to apply to the button
  //
  // @property {Ember.Array} classNames
  //
  classNames: ['zz-button', 'btn'],

  // Bind the specified properties as the classes of the DOM element.
  //
  classNameBindings: ['kindClass', 'sizeClass', 'extraClasses'],

  // Extra css classes 
  //
  // @property {Ember.String}
  // @default  null
  // @public
  //
  extraClasses: null,

  // True if the button is enabled and can be clicked.
  // @property enabled
  // @public
  //
  enabled: true,

  // The status of the button, can be one of the following:
  // default - The button is enabled and ready to be clicked.
  // pending - The promise bound to the button was sent and the promise is still pending
  // fulfilled - The promise was fulfilled properly.
  // rejected - The promise bound to the button was finished as rejected.
  //
  // The status is also bound to the DOM as `status` property, this allows to easily change styles for every
  // status by using `.zz-button[status=fulfilled]` syntax.
  //
  // The label of the button will change to the value of the component properties that correspond to the
  // statuses mentioned above.
  //
  // @property status
  // @private
  //
  status: 'default',

  // The action name to send to the controller when the button is clicked.
  // @property action
  // @public
  //
  'action': void 0,

  // The size of the button
  //
  // @property {string} size
  // @default  "medium"
  //
  size: 'medium',

  // The visual "kind" of button
  //
  // @property {Ember.String} kind
  // @default  "default"
  // @public
  //
  kind: 'default',

  // Icon classes (if any)
  //
  // @property {Ember.String} icon
  // @default  null
  // @public
  //
  icon: null,

  // The delay addded before firing async button.
  //
  // @property {Ember.Integer} delay
  // @default  250
  // @public
  //
  delay: 250,

  // The valid statuses of button status.
  //
  // @property statuses
  // @private
  //
  statuses: ['default','pending','fulfilled','rejected'],

  // True if the button is not enabled or is in status 'pending'.
  // @function disabled
  // @public
  //
  disabled: (function() {
    return !this.get('enabled') || this.get('status') === 'pending';
  }).property('enabled', 'status'),

  // Set by the `click` callback, if set, the promise will be observed and the button's status will be
  // changed accordingly.
  // @property promise
  // @private
  //
  promise: void 0,

  // Convert kind to button kind class
  //
  // @function kindClass
  // @observes kind
  // @returns  {Ember.String} Defaults to "btn-default"
  //
  kindClass: (function() {
    var kind = this.get('kind');
    return !Ember.isEmpty(kind) ? 'btn-'+kind : null;
  }).property('kind'),
  
  // Converted size string to Bootstrap button class
  //
  // @function sizeClass
  // @observes size
  // @returns  {Ember.String} Defaults to undefined
  //
  sizeClass: (function() {
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
  }).property('size'),

  // Converted icon string to Bootstrap button class
  //
  // @function iconClass
  // @observes status, icon, icon-pending, icon-fulfilled, icon-rejected
  // @returns  {Ember.String} Defaults to undefined
  //
  iconClass: (function() {
    var propName = (~this.statuses.indexOf(this.status) ? "icon-" + this.status : 'icon');
    return this.getWithDefault(propName, this.get('icon'));
  }).property('status', 'icon', 'icon-pending', 'icon-fulfilled', 'icon-rejected','statuses'),

  // The label of the button, calculated according to the status of the button
  // See the `status` property documentation for more info.
  //
  // @function labelContent
  // @observes status, label, label-pending, label-fulfilled, label-rejected
  // @public
  //
  labelContent: (function() {
    var propName = (~this.statuses.indexOf(this.status) ? "label-" + this.status : 'label');
    return this.getWithDefault(propName, this.get('label'));
  }).property('status', 'label', 'label-pending', 'label-fulfilled', 'label-rejected','statuses'),

  // The later delay for the button, calculated according to the status of the button
  // See the `status` property documentation for more info.
  //
  // @function laterDelay
  // @observes status, label-pending, label-fulfilled, label-rejected, icon-pending, icon-fulfilled, icon-rejected
  // @public
  //
  laterDelay: (function() {
    return ((!Ember.isEmpty(this.get('label-pending')) || 
              !Ember.isEmpty(this.get('label-fulfilled')) || 
              !Ember.isEmpty(this.get('label-rejected')) || 
              !Ember.isEmpty(this.get('icon-pending')) || 
              !Ember.isEmpty(this.get('icon-fulfilled')) || 
              !Ember.isEmpty(this.get('icon-rejected'))) ? this.get('delay') : 0); 
  }).property('label-pending', 'label-fulfilled', 'label-rejected', 'icon-pending', 'icon-fulfilled', 'icon-rejected'),

  // Triggered when the button is clicked
  // Invoke the action name on the controller defined in the `action` property, default is `onClick`.
  // The action on the controller recieves a property that should be set to the promise being invoked (if there is one)
  // If a promise was set, the button will move to 'pending' status until the promise will be fulfilled
  //
  // @function onClick
  // @private
  //
  click: (function() {
    var action = this.get('action');

    if (!Ember.isEmpty(action)) {
      var _this = this;
     _this.set('status', 'pending');
      return Ember.run.later(function() {
        _this.get('targetObject').send(action, (function(_this) {
          return function(promise) {
            _this.set('promise', promise);
            return;
          };
        })(_this));

      }, this.get('laterDelay'));
    }
    return false;
  }),

  // Observes the action promise property and restores button status
  //
  // @function handlePromise
  // @observes promise
  // @private
  //
  handlePromise: (function() {
    return this.get('promise').then((function(_this) {
      return function() {
        return _this.set('status', 'fulfilled');
      };
    })(this), (function(_this) {
      return function(err) {
        _this.set('status', 'rejected');
        return _this.set('error', err);
      };
    })(this));
  }).observes('promise')

});
