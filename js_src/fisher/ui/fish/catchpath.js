/**
 * Renders a catch path.
 */

goog.provide('ff.fisher.ui.fish.CatchPath');

goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.fisher.ui.tooltip.Tooltip');
goog.require('ff.model.FishingTackle');
goog.require('ff.service.FishService');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.CatchPath} catchPath
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.CatchPath = function(catchPath) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.CatchPath');

  /** @private {!ff.fisher.ui.tooltip.Tooltip} */
  this.tooltip_ = ff.fisher.ui.tooltip.Tooltip.getInstance();

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.model.CatchPath} */
  this.catchPath_ = catchPath;
};
goog.inherits(ff.fisher.ui.fish.CatchPath, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.CatchPath.Css_ = {
  CATCH_PATH_PART: goog.getCssName('ff-fish-catch-path-part')
};


/** @override */
ff.fisher.ui.fish.CatchPath.prototype.createDom = function() {
  var catchPathParts = [];
  goog.array.forEach(this.catchPath_.getCatchPathParts(), function(part) {
    catchPathParts.push({
      imageUrl: part.getImageUrl(),
      detailUrl: this.getDetailUrl_(part)
    });
  }, this);
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.CATCH_PATH, {
        catchPathPartCss: ff.fisher.ui.fish.CatchPath.Css_.CATCH_PATH_PART,
        catchPathParts: catchPathParts
      }));
};


/** @override */
ff.fisher.ui.fish.CatchPath.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var elements = goog.dom.getChildren(this.getElement());
  var catchPathParts = this.catchPath_.getCatchPathParts();

  var partIndex = 0;
  goog.array.forEach(elements, function(element) {
    if (goog.dom.classlist.contains(
        element, ff.fisher.ui.fish.CatchPath.Css_.CATCH_PATH_PART)) {
      var part = catchPathParts[partIndex];

      this.tooltip_.registerElement(
          this.getHandler(),
          element,
          part.getName());

      partIndex++;
    }
  }, this);
};


/**
 * @param {!ff.model.CatchPathPart} catchPathPart
 * @return {string}
 * @private
 */
ff.fisher.ui.fish.CatchPath.prototype.getDetailUrl_ = function(catchPathPart) {
  if (catchPathPart instanceof ff.model.FishingTackle) {
    var tackle = /** @type {!ff.model.FishingTackle} */ (catchPathPart);
    return tackle.getDetailUrl();
  } else {
    var mooch = /** @type {!ff.model.Mooch} */ (catchPathPart);
    return mooch.getDetailUrl(this.fishService_);
  }
};
