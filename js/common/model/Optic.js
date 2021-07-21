// Copyright 2021, University of Colorado Boulder

/**
 * Abstract class of an optical element in the simulation.
 * An optical element is the base class for a lens or a mirror.
 * Responsibility include the radius of curvature, the diameter and the curve
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class Optic {

  /**
   *
   * @param {Vector2} position - center of the optical element
   * @param {RangeWithValue} radiusOfCurvatureRange - range of radius of curvature (in centimeters)
   * @param {RangeWithValue} diameterRange - range of height for optical element (in centimeters)
   * @param {Optic.Curve} curve - initial curve of optical element - acceptable values (CONVEX and CONCAVE)
   * @param {Optic.Type} type - initial type of optical element - acceptable values (MIRROR and LENS)
   * @param {Tandem} tandem
   */
  constructor( position, radiusOfCurvatureRange, diameterRange, curve, type, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( position instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalid radiusOfCurvature' );
    assert && assert( diameterRange instanceof RangeWithValue, 'invalid diameterRange' );

    // @public {Property.<Vector2>} Position of the optical element
    this.positionProperty = new Vector2Property( position );

    // @public {Property.<number>} Radius of curvature of the optical element - The convention is positive as converging.
    this.radiusOfCurvatureProperty = new NumberProperty( radiusOfCurvatureRange.defaultValue, { range: radiusOfCurvatureRange } );

    // @public {Property.<number>} Height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( diameterRange.defaultValue, { range: diameterRange } );

    // @public {Property.<Optic.Curve>} Type of Curvature of the optical element.
    this.curveProperty = new EnumerationProperty( Optic.Curve, curve );

    // @private {Optic.Type} Type of the optical element ( valid choices: LENS and MIRROR)
    this.type = type;

    // @public {Property.<boolean>} is the optical element converging.
    this.isConvergingProperty = new DerivedProperty( [ this.curveProperty ], curve => {
      return this.isConverging( curve );
    } );

    // @public {Property.<number>} is the optical element converging.
    // +1 is the optical element is converging and -1 if it is diverging
    this.convergingSignProperty = new DerivedProperty( [ this.curveProperty ], curve => {
      return this.getConvergingSign( curve );
    } );

    // @public {Property.<Object>} shapes (fill and outline) of the optical element
    this.outlineAndFillProperty = new DerivedProperty( [
        this.radiusOfCurvatureProperty,
        this.diameterProperty,
        this.curveProperty ],
      ( radius, diameter, curve ) => {
        return this.getFillAndOutlineShapes( radius, diameter, curve );
      } );

    // @public {Property.<number>} - must be implemented by subtype
    this.focalLengthProperty = new Error( 'must be implemented by subtype' );

    // @private {number}
    this.diameterRange = diameterRange;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.curveProperty.reset();
  }

  /**
   * sets the y position of the optical element while keeping the x-coordinate constant
   * @public
   * @param {number} yCoordinate
   */
  setVerticalCoordinate( yCoordinate ) {
    this.positionProperty.value = new Vector2( this.positionProperty.value.x, yCoordinate );
  }

  /**
   * Returns a boolean indicating if the optical element is a lens
   * @public
   * @returns {boolean}
   */
  isLens() {
    return this.type === Optic.Type.LENS;
  }

  /**
   * Returns a boolean indicating if the optical element is a mirror
   * @public
   * @returns {boolean}
   */
  isMirror() {
    return this.type === Optic.Type.MIRROR;
  }

  /**
   * Returns a boolean indicating if the optical element is concave
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConcave( curve ) {
    return curve === Optic.Curve.CONCAVE;
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConvex( curve ) {
    return curve === Optic.Curve.CONVEX;
  }

  /**
   * Returns a boolean indicating if the optical element has the potential to converge rays.
   * This is solely a property of the optical element.
   * A convex lens and a concave mirror are converging optical elements.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConverging( curve ) {
    return ( this.isConvex( curve ) && this.isLens() ) || ( this.isConcave( curve ) && this.isMirror() );
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isDiverging( curve ) {
    return !this.isConverging( curve );
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is converging and -1 is the element is diverging.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getConvergingSign( curve ) {
    return this.isConverging( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is convex and -1 is the element is concave.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getCurveSign( curve ) {
    return this.isConvex( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is a lens and -1 is the element is a mirror.
   * @public
   * @returns {number}
   */
  getTypeSign() {
    return this.isLens() ? 1 : -1;
  }

  /**
   * Returns the type of optical element (Possible values are CONCAVE and CONVEX).
   * @public
   * @returns {Optic.Curve}
   */
  getCurve() {
    return this.curveProperty.value;
  }

  /**
   * Returns the position of the optical element
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.positionProperty.value;
  }

  /**
   * Returns a normalized value (with a max of 1) for the diameter
   * @param {number} diameter - diameter
   * @public
   * @returns {number}
   */
  getNormalizedDiameter( diameter ) {
    return diameter / this.diameterRange.max;
  }

  /**
   * @public @abstract
   */
  getFillAndOutlineShapes() { throw new Error( 'must be implemented by subtype' ); }

  /**
   * Returns the shape of the vertical line
   * @public
   * @returns {Shape}
   */
  getPrincipalLine() {

    const yMax = 200; // in centimeters

    // a straight vertical line going through the middle of the optic
    const verticalLine = Shape.lineSegment( 0, yMax, 0, -yMax );

    return this.translatedShape( verticalLine );
  }

  /**
   * returns a shape translated by the model position of the optic
   * @public
   * @param {Shape} shape
   * @returns {Shape}
   */
  translatedShape( shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.getPosition() ) );
  }

  /**
   * @public
   * @returns {Bounds2}
   */
  getOpticBounds() {
    const outlineShape = this.outlineAndFillProperty.value.outlineShape;
    const translatedShape = this.translatedShape( outlineShape );
    return translatedShape.getBounds();
  }

  /**
   * returns the most extreme position within the optic that would ensure that a ray would
   * be transmitted  (or reflected).
   * (see #111)
   *
   * @public
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @param {Object} [options]
   * @returns {Vector2}
   */
  getExtramumPoint( sourcePoint, targetPoint, options ) {
    options = merge( {
      location: Optic.Location.TOP
    }, options );

    // erode the bounds a tiny bit such that such that the point is always within the bounds
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isTop = ( options.location === Optic.Location.TOP );
    const isConcave = this.isConcave( this.getCurve() );
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;
    const centerPoint = isTop ? opticBounds.centerTop : opticBounds.centerBottom;
    const opticPoint = this.positionProperty.value;

    // extrema point along the direction of the ray - may not be on the optic itself
    let spotPoint;

    if ( this.isMirror() ) {

      // since mirror reflect light, the spot point on the mirror itself
      spotPoint = isConcave ? leftPoint : rightPoint;
    }
    else {
      // must be lens

      if ( isConcave ) {

        // displacement vector from targetPoint to the right corner of the lens
        const rightTarget = rightPoint.minus( targetPoint );

        // displacement vector from sourcePoint to the left corner of the lens
        const leftSource = leftPoint.minus( sourcePoint );

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset1 = ( rightPoint.y - opticPoint.y ) + ( opticPoint.x - rightPoint.x ) *
                         rightTarget.y / rightTarget.x;

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset2 = ( leftPoint.y - opticPoint.y ) + ( opticPoint.x - leftPoint.x ) * leftSource.y / leftSource.x;

        // find the smallest offset to ensure that a ray will always hit both front and back surfaces
        const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

        // get the direction of the ray as measured from the source
        spotPoint = opticPoint.plusXY( 0, offsetY );
      }

      else {
        // must be a convex lens

        // spot is based on the edge point (which is centered horizontally on the optic)
        spotPoint = centerPoint;
      }
    }

    return spotPoint;
  }
}

Optic.Type = Enumeration.byKeys( [
  'LENS', // lens
  'MIRROR' //mirror
] );

Optic.Curve = Enumeration.byKeys( [
  'CONVEX',
  'CONCAVE'
] );

Optic.Location = Enumeration.byKeys( [
  'TOP',
  'BOTTOM' ] );

geometricOptics.register( 'Optic', Optic );
export default Optic;
