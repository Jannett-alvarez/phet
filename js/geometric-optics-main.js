// Copyright 2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author veillette
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import geometricOpticsStrings from './geometricOpticsStrings.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';

const simOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode see #146
  credits: {
    leadDesign: 'Amy Rouinfar',
    softwareDevelopment: 'Sarah Chang, Martin Veillette',
    team: 'Kathy Perkins',
    qualityAssurance: 'Kathryn Woessner',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  const sim = new Sim( geometricOpticsStrings[ 'geometric-optics' ].title, [
    new LensScreen( Tandem.ROOT.createTandem( 'lensScreen' ) ),
    new MirrorScreen( Tandem.ROOT.createTandem( 'mirrorScreen' ) )
  ], simOptions );
  sim.start();
} );
