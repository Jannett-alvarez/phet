// Copyright 2021, University of Colorado Boulder

/**
 * View for visual tracking of an object
 * Most often used by QueryParameters to illustrate the position of a point or an object.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TrackingDiskNode extends Circle {

  /**
   * @param {Property.<Vector2>} positionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   * */
  constructor( positionProperty,
               modelViewTransform,
               tandem,
               options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {

      // {color} fill of disk
      fill: 'white',

      // {number} radius of disk in view coordinates.
      radius: 2

    }, options );

    super( options.radius, options );

    // update position of disk
    positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

geometricOptics.register( 'TrackingDiskNode', TrackingDiskNode );
export default TrackingDiskNode;
