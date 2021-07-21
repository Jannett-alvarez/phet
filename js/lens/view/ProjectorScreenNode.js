// Copyright 2021, University of Colorado Boulder

/**
 * View of of the projectorScreen
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectorScreen3dImage from '../../../images/projector-screen-3d_png.js';
import geometricOpticsColorProfile from '../../common/geometricOpticsColorProfile.js';
import geometricOptics from '../../geometricOptics.js';

const SPOTLIGHT_FILL = geometricOpticsColorProfile.projectorScreenSpotlightFillProperty;

class ProjectorScreenNode extends Node {

  /**
   * @param {ProjectorScreen} projectorScreen
   * @param {Property.<Representation>} representationProperty
   * @param {Property.<boolean>} enableFirstSpotlightProperty - have the rays from the first source reached the screen
   * @param {Property.<boolean>} enableSecondSpotlightProperty - have the rays from the second source reached the screen
   * @param {Property.<boolean>} visibleSecondSourceProperty - is the second source checkbox on.
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( projectorScreen,
               representationProperty,
               enableFirstSpotlightProperty,
               enableSecondSpotlightProperty,
               visibleSecondSourceProperty,
               visibleModelBoundsProperty,
               modelViewTransform,
               tandem,
               options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    // create projectorScreen target
    const projectorScreenImage = new Image( projectorScreen3dImage, { scale: 0.5 } );

    // add projectorScreen image to scene graph
    this.addChild( projectorScreenImage );

    // difference between the left top position of the image and the "center" of the blackboard
    const offset = new Vector2( -30, 75 );

    // @private {Property.<Vector2} create a property for the left top position of the projectorScreen target
    this.imagePositionProperty = new Vector2Property( projectorScreen.positionProperty.value.plus( offset ) );

    // TODO: the model should give its size to the view rather than the other way around.
    // determine the size of the projector in model coordinates
    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( this.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( this.width );

    // keep at least half of the projector screen within visible bounds and right of the optic
    const projectorScreenDragBoundsProperty = new DerivedProperty( [ visibleModelBoundsProperty, projectorScreen.opticPositionProperty ],
      ( visibleBounds, opticPosition ) => {
        return new Bounds2( opticPosition.x,
          visibleBounds.minY + modelChildHeight / 2,
          visibleBounds.maxX - modelChildWidth / 2,
          visibleBounds.maxY + modelChildHeight / 2 );
      } );

    // create a drag listener for the image
    const dragListener = new DragListener( {
      positionProperty: this.imagePositionProperty,
      dragBoundsProperty: projectorScreenDragBoundsProperty,
      transform: modelViewTransform
    } );

    // always keep projector screen in visible/drag bounds when visible bounds are changed
    projectorScreenDragBoundsProperty.link( dragBounds => {
      this.imagePositionProperty.value = dragBounds.closestPointTo( this.imagePositionProperty.value );
    } );

    // update the position of projectorScreen target
    this.imagePositionProperty.link( position => {
      projectorScreen.positionProperty.value = position.minus( offset );
      projectorScreenImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    // add input listener to projectorScreen target
    projectorScreenImage.addInputListener( dragListener );

    // add a listener to trigger the visibility of this node
    representationProperty.link( representation => {

      // display this node if this is a source, that is not an object
      this.visible = !representation.isObject;
    } );

    /**
     * Create and add a spotlight on projectorScreen
     * @param {Spotlight} spotlight
     * @param {Property.<boolean>} visibleProperty
     */
    const addSpotLightNode = ( spotlight, visibleProperty ) => {

      // create spotlight
      const spotlightNode = new Path( new Shape( spotlight.shapeProperty.value ),
        { fill: SPOTLIGHT_FILL } );

      // update the intensity of light to the opacity of the scenery node
      spotlight.intensityProperty.link( intensity => {
        spotlightNode.opacity = intensity;
      } );

      // update the shape of the spotlight
      spotlight.shapeProperty.link( shape => {
        spotlightNode.shape = modelViewTransform.modelToViewShape( shape );
      } );

      visibleProperty.linkAttribute( spotlightNode, 'visible' );

      // add the spotlight to this node
      this.addChild( spotlightNode );
    };

    // add spotlight due to always present source
    addSpotLightNode( projectorScreen.firstSpotlight, enableFirstSpotlightProperty );

    // {Property.<boolean>} create a property for the visibility of the second source spotlight
    const visibleSecondSourceSpotlightProperty = DerivedProperty.and(
      [ enableSecondSpotlightProperty, visibleSecondSourceProperty ] );

    // add second spotlight for the "second source"
    addSpotLightNode( projectorScreen.secondSpotlight, visibleSecondSourceSpotlightProperty );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.imagePositionProperty.reset();
  }
}

geometricOptics.register( 'ProjectorScreenNode', ProjectorScreenNode );
export default ProjectorScreenNode;
