// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the target or image
 * Responsible for the position and scale of target.
 *
 * @author Martin Veillette
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

class TargetImage {

  /**
   * @param {SourceObject} sourceObject
   * @param {OpticalElement} opticalElement
   * @param {Tandem} tandem
   */
  constructor( sourceObject, opticalElement, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the image
    this.positionProperty = new Vector2Property( new Vector2( 2, 1 ) );

    // @public {Property.<number>} scaling factor of the image wrt the object
    this.scaleProperty = new NumberProperty( 1 );

    // @public (read-only) {SourceObject}
    this.sourceObject = sourceObject;

    // @public (read-only) {OpticalElement}
    this.opticalElement = opticalElement;

    // @public (read-only) {Property.<boolean>}
    this.isInvertedImageProperty = new BooleanProperty( false );

    // updates the position of the image
    Property.multilink( [ sourceObject.positionProperty, opticalElement.positionProperty, opticalElement.focalLengthProperty ],
      ( objectPosition, opticalElementPosition, focalLength ) => {
        const distanceObject = opticalElementPosition.x - objectPosition.x;
        const heightObject = objectPosition.y - opticalElementPosition.y;
        const f = focalLength;
        const distanceImage = ( f * distanceObject ) / ( distanceObject - f );
        const magnification = -1 * distanceImage / distanceObject;
        const yOffset = heightObject * magnification;
        this.positionProperty.value = opticalElementPosition.plus( new Vector2( distanceImage, yOffset ) );
        this.isInvertedImageProperty.value = this.isInvertedImage();
        this.updateScale();
      } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.scaleProperty.reset();
  }


  /**
   * Updates the scale of the image
   * @public
   */
  updateScale() {
    const focalLength = this.getFocalLength();
    this.scaleProperty.value = focalLength / ( this.getObjectLensDistance() - focalLength );
  }

  /**
   * Returns the height of the image in meter.
   * The height can be negative if the image is upside down.
   * @public
   * @returns {number}
   */
  getHeight() {
    return this.getMagnification() * ( this.sourceObject.positionProperty.value.y -
                                       this.opticalElement.positionProperty.value.y );
  }

  /**
   * Returns the magnification of the image.
   * A negative magnification implies that the image is inverted.
   * @public
   * @returns {number}
   */
  getMagnification() {
    return -1 * this.getImageLensDistance() / this.getObjectLensDistance();
  }

  /**
   * Returns the horizontal distance between the object and the optical element.
   * A negative distance indicates that the object is to the right of the optical element.
   * @public
   * @returns {number}
   */
  getObjectLensDistance() {
    return this.opticalElement.positionProperty.value.x - this.sourceObject.positionProperty.value.x;
  }

  /**
   * Returns the focal length of the optical element in meters
   * The focal length is positive for converging optical elements and negative for diverging.
   * @public
   * @returns {number}
   */
  getFocalLength() {
    return this.opticalElement.focalLengthProperty.value;
  }

  /**
   * Returns the horizontal distance of the image from the opticalElement.
   * A negative distance indicates that the image os to the left of the optical element.
   * @public
   * @returns {number}
   */
  getImageLensDistance() {
    const distanceObject = this.getObjectLensDistance();
    const f = this.getObjectLensDistance();
    return ( f * distanceObject ) / ( distanceObject - f );
  }

  /**
   * Returns a boolean indicating if the image is virtual
   * @public
   * @returns {boolean}
   */
  isInvertedImage() {
    return this.getObjectLensDistance() < this.getFocalLength() || this.getFocalLength() < 0;
  }
}

geometricOptics.register( 'TargetImage', TargetImage );
export default TargetImage;
