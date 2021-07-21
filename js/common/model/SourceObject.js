// Copyright 2021, University of Colorado Boulder

/**
 * Model element for object (in the sense commonly used in geometric optic) or source of light
 * The sourceObject has a position and a "second source" position within it.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const DEFAULT_SOURCE_POINT_1 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1;
const DEFAULT_SOURCE_POINT_2 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2;
const verticalOffsetRange = new RangeWithValue( -50, 0, -30 );

class SourceObject {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Representation>} representationProperty
   * @param {Tandem} tandem
   */
  constructor( opticPositionProperty, representationProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the source/object
    this.firstPositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_1 );

    // @private {Property.<Vector2>} position of the second source of light
    this.unconstrainedSecondSourcePositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_2 );

    // @private {Property.<number>} vertical offset (in centimeters) of second object with respect to the first
    this.verticalOffsetProperty = new NumberProperty( verticalOffsetRange.defaultValue );

    // @public {Vector2|null} initial Position of the optic
    this.initialOpticPosition = null;

    // @public {read-only} initial position of the optic
    this.opticPositionProperty = opticPositionProperty;

    // @public {Property.<Vector2>} position of the second source (source/object)
    this.secondPositionProperty =
      new DerivedProperty( [ this.firstPositionProperty,
          this.verticalOffsetProperty,
          this.unconstrainedSecondSourcePositionProperty,
          representationProperty ],
        ( position, verticalOffset, unconstrainedPosition, representation ) => {
          if ( representation.isObject ) {
            return position.plusXY( 0, verticalOffset );
          }
          else {
            return unconstrainedPosition;
          }
        } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.firstPositionProperty.reset();
    this.verticalOffsetProperty.reset();
    this.unconstrainedSecondSourcePositionProperty.reset();
  }

  /**
   * Returns the position of the source
   * @returns {Vector2}
   * @public
   */
  getPosition() {
    return this.firstPositionProperty.value;
  }

  /**
   * Sets the position of the source
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {
    this.firstPositionProperty.value = position;
  }

  /**
   * Sets the second source point
   * @param {Property.<Representation>} representationProperty
   * @param {Vector2} position
   * @public
   */
  setSecondPoint( representationProperty, position ) {
    if ( representationProperty.value.isObject ) {
      const unconstrainedVerticalOffset = position.y - this.firstPositionProperty.value.y;
      this.verticalOffsetProperty.value = Utils.clamp( unconstrainedVerticalOffset, verticalOffsetRange.min, verticalOffsetRange.max );
    }
    else {
      this.unconstrainedSecondSourcePositionProperty.value = position;
    }
  }

  /**
   * get the position of the optic
   * @public
   * @returns {Vector2} position
   */
  getOpticPosition() {
    return this.opticPositionProperty.value;
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
