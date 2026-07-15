// Scale each A4 sheet to fit its column on screen; print uses true A4.
    (function () {
      var W = 794, H = 1123;
      function fit() {
        var printing = window.matchMedia && window.matchMedia('print').matches;
        document.querySelectorAll('.frame').forEach(function (frame) {
          var sheet = frame.querySelector('.sheet');
          if (!sheet) return;
          if (printing) { sheet.style.transform = 'none'; frame.style.height = ''; return; }
          var scale = Math.min(1, frame.clientWidth / W);
          sheet.style.transform = 'scale(' + scale + ')';
          frame.style.height = (H * scale) + 'px';
        });
      }
      function clearForPrint() {
        document.querySelectorAll('.frame').forEach(function (frame) {
          var sheet = frame.querySelector('.sheet');
          if (sheet) sheet.style.transform = '';
          frame.style.height = '';
        });
      }
      window.addEventListener('resize', fit);
      window.addEventListener('load', fit);
      window.addEventListener('beforeprint', clearForPrint);
      window.addEventListener('afterprint', fit);
      if (window.matchMedia) {
        var mq = window.matchMedia('print');
        (mq.addEventListener ? mq.addEventListener('change', fit) : mq.addListener(fit));
      }
      fit();
    })();
