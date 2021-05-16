// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the target or image
 * Responsible for the position and scale of target.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetImage {

  /**
   * @param {SourceObject} sourceObject
   * @param {Optic} optic
   * @param {Tandem} tandem
   */
  constructor( sourceObject, optic, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public (read-only) {SourceObject}
    this.sourceObject = sourceObject;

    // @public (read-only) {Optic}
    this.optic = optic;

    // @public (read-only) {DerivedProperty.<boolean>}
    this.isInvertedProperty = new DerivedProperty( [ sourceObject.positionProperty,
      optic.positionProperty,
      optic.focalLengthProperty ], () => {
      return this.isInverted();
    } );

    // @public (read-only) {DerivedProperty.<number>}
    this.scaleProperty = new DerivedProperty( [ sourceObject.positionProperty,
      optic.positionProperty,
      optic.focalLengthProperty ], () => {
      return this.scale();
    } );

    // updates the position of the image
    // @public (read-only) {DerivedProperty.<Vector2>}
    this.positionProperty = new DerivedProperty( [ sourceObject.positionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {
        return this.position( objectPosition, opticPosition, focalLength );
      } );

  }

  /**
   * @public
   */
  reset() {

  }

  /**
   * Return the scale of the image, i.e. the ratio of the height of the image over the object
   * The scale will be negative if the image is inverted.
   * @returns {number}
   * @public
   */
  scale() {
    const focalLength = this.getFocalLength();
    return focalLength / ( this.getObjectOpticDistance() - focalLength );
  }

  /**
   * Returns the height of the image in meter.
   * The height can be negative if the image is upside down.
   * @public
   * @returns {number}
   */
  getHeight() {
    return this.getMagnification() * ( this.sourceObject.positionProperty.value.y -
                                       this.optic.positionProperty.value.y );
  }

  /**
   * Returns the magnification of the image.
   * A negative magnification implies that the image is inverted.
   * @public
   * @returns {number}
   */
  getMagnification() {
    return -1 * this.getImageOpticDistance() / this.getObjectOpticDistance();
  }

  /**
   * Returns the horizontal distance between the object and the optical element.
   * A negative distance indicates that the object is to the right of the optical element.
   * @public
   * @returns {number}
   */
  getObjectOpticDistance() {
    return this.optic.positionProperty.value.x - this.sourceObject.positionProperty.value.x;
  }

  /**
   * Returns the focal length of the optical element in meters
   * The focal length is positive for converging optical elements and negative for diverging.
   * @public
   * @returns {number}
   */
  getFocalLength() {
    return this.optic.focalLengthProperty.value;
  }

  /**
   * Returns the horizontal distance of the image from the optic.
   * A negative distance indicates that the image is to the left of the optical element.
   * @public
   * @returns {number}
   */
  getImageOpticDistance() {
    const distanceObject = this.getObjectOpticDistance();
    const f = this.getFocalLength();
    return ( f * distanceObject ) / ( distanceObject - f );
  }

  /**
   * Returns a boolean indicating if the image is inverted
   * For a lens, the image is inverted if the image is on the opposite side of the object
   * For a mirror, the image is inverted if the image is on the same side of the object
   * @public
   * @returns {boolean}
   */
  isInverted() {
    return this.optic.isLens() ? this.isOppositeSide() : this.isSameSide();
  }

  /**
   * @public
   * @returns {boolean}
   */
  isUpright() {
    return !this.isInverted();
  }

  /**
   * Returns a boolean indicating if the image is virtual
   * For a lens, the image is virtual if the image is on the same side as the object
   * For a mirror, the image is virtual if the image is on the opposite of the object
   *
   * @public
   * @returns {boolean}
   */
  isVirtual() {
    return this.optic.isLens() ? this.isSameSide() : this.isOppositeSide();
  }

  /**
   * @public
   * @returns {boolean}
   */
  isReal() {
    return !this.isVirtual();
  }

  /**
   * Returns a boolean indicating if the image is on the same (spatial) side of the object (with respect to the optical element)
   * @public
   * @returns {boolean}
   */
  isSameSide() {
    const sign = Math.sign( this.getImageOpticDistance() * this.getObjectOpticDistance() );
    return sign === 1;
  }

  /**
   * Returns a boolean indicating if the image is on the opposite side of the optical element from the object
   * @public
   * @returns {boolean}
   */
  isOppositeSide() {
    return !this.isSameSide();
  }

  /**
   * returns the position of the image
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {Vector2}
   * @public
   */
  position( objectPosition, opticPosition, focalLength ) {
    const distanceObject = opticPosition.x - objectPosition.x;
    const heightObject = objectPosition.y - opticPosition.y;
    const f = focalLength;
    const sign = this.optic.isLens() ? 1 : -1;
    const distanceImage = sign * ( f * distanceObject ) / ( distanceObject - f );
    const magnification = -1 * distanceImage / distanceObject;
    const yOffset = sign * heightObject * magnification;
    return opticPosition.plus( new Vector2( distanceImage, yOffset ) );
  }
}

geometricOptics.register( 'TargetImage', TargetImage );
export default TargetImage;
