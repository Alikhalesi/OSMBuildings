// TODO: handle multiple markers
// A: cluster them into 'tiles' that give close reference point and allow simpler visibility tests or
// B: handle them as individual objects

class MarkerRender {

  constructor () {

    this.shader = new GLX.Shader({
      vertexShader: Shaders.marker.vertex,
      fragmentShader: Shaders.marker.fragment,
      shaderName: 'marker shader',
      attributes: ['aPosition', 'aTexCoord'], //
      uniforms: [
        'uProjMatrix',
        'uViewMatrix',
        'uModelMatrix',
        'uTexIndex'
      ]
    });

  }

  render () {
    const shader = this.shader;

    shader.enable();

    const metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * Math.cos(APP.position.latitude / 180 * Math.PI);

    var markers = Markers.items;

    GL.disable(GL.DEPTH_TEST);
    GL.enable(GL.BLEND);
    // GL.blendFuncSeparate(GL.ONE_MINUS_DST_ALPHA, GL.DST_ALPHA, GL.ONE, GL.ONE);
    // GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

    // GL.blendFunc(GL.SRC_COLOR, GL.ONE);

    GL.blendFunc(GL.SRC_ALPHA  , GL.ONE);


    // console.log(GL.getParameter(GL.SRC_ALPHA))
    // GL.disable(GL.DEPTH_TEST);

    markers.forEach(item => {
      if(!item.isReady){
        return;
      }




    // console.log(item)
      const modelMatrix = new GLX.Matrix();
      modelMatrix.translate(
        (item.position.longitude - APP.position.longitude) * metersPerDegreeLongitude,
        -(item.position.latitude - APP.position.latitude) * METERS_PER_DEGREE_LATITUDE,
        item.elevation
      );

      shader.setMatrix('uProjMatrix', '4fv', render.projMatrix.data);
      shader.setMatrix('uViewMatrix', '4fv', render.viewMatrix.data);
      shader.setMatrix('uModelMatrix', '4fv', modelMatrix.data);
      shader.setBuffer('aPosition', item.vertexBuffer);

      shader.setBuffer('aTexCoord', item.texCoordBuffer);
      shader.setTexture('uTexIndex', 0, item.texture);

      GL.drawArrays(GL.TRIANGLES, 0, item.vertexBuffer.numItems);

    })


    GL.disable(GL.BLEND);
    GL.enable(GL.DEPTH_TEST);

    shader.disable();
  }


  destroy () {
    // this.vertexBuffer.destroy();
    // this.texCoordBuffer.destroy();
    //
    // if (this.texture) {
    //   this.texture.destroy();
    // }
  }
}
