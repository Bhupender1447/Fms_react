import React, { useEffect } from "react";

const AdminLayout = ({ children }) => {
  useEffect(() => {
    // ------------------ CSS LOAD ------------------
    const cssLinks = [
      "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Poppins&display=swap",
      "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700",
      `${process.env.PUBLIC_URL}/css/bootstrap.css`,
      `${process.env.PUBLIC_URL}/bower_components/font-awesome/css/font-awesome.min.css`,
      `${process.env.PUBLIC_URL}/bower_components/Ionicons/css/ionicons.min.css`,
      `${process.env.PUBLIC_URL}/dist/css/AdminLTE.min.css`,
      `${process.env.PUBLIC_URL}/dist/css/skins/_all-skins.min.css`,
      `${process.env.PUBLIC_URL}/bower_components/morris.js/morris.css`,
      `${process.env.PUBLIC_URL}/bower_components/jvectormap/jquery-jvectormap.css`,
      `${process.env.PUBLIC_URL}/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css`,
      `${process.env.PUBLIC_URL}/bower_components/bootstrap-daterangepicker/daterangepicker.css`,
      `${process.env.PUBLIC_URL}/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css`,
      `${process.env.PUBLIC_URL}/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css`,
      `${process.env.PUBLIC_URL}/bower_components/select2/dist/css/select2.min.css`,
      `${process.env.PUBLIC_URL}/plugins/fileinput/fileinput.min.css`,
      `${process.env.PUBLIC_URL}/css/style.css`,
      `${process.env.PUBLIC_URL}/css/responsive.css`,
      "http://www.shieldui.com/shared/components/latest/css/light/all.min.css",
      "https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.17.0.css",
    ];

    cssLinks.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });

    // ------------------ JS LOAD ------------------
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const loadScripts = async () => {
      try {
        // jQuery first
        await loadScript(`${process.env.PUBLIC_URL}/bower_components/jquery/dist/jquery.min.js`);

        // jQuery UI
        await loadScript(`${process.env.PUBLIC_URL}/bower_components/jquery-ui/jquery-ui.min.js`);

        // Bridge
        const bridgeScript = document.createElement("script");
        bridgeScript.innerHTML = `$.widget.bridge("uibutton", $.ui.button);`;
        document.body.appendChild(bridgeScript);

        // Bootstrap
        await loadScript(`${process.env.PUBLIC_URL}/bower_components/bootstrap/dist/js/bootstrap.min.js`);

        // ------------------ DataTables FIX ------------------
        // 1. Load DataTables core
        await loadScript(
          `${process.env.PUBLIC_URL}/bower_components/datatables.net/js/jquery.dataTables.min.js`
        );

        // 2. Load DataTables Bootstrap adapter
        await loadScript(
          `${process.env.PUBLIC_URL}/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js`
        );
        // ----------------------------------------------------

        // Remaining scripts (order doesn't matter now)
        const remainingScripts = [
          `${process.env.PUBLIC_URL}/bower_components/raphael/raphael.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/morris.js/morris.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js`,
          `${process.env.PUBLIC_URL}/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js`,
          `${process.env.PUBLIC_URL}/plugins/jvectormap/jquery-jvectormap-world-mill-en.js`,
          `${process.env.PUBLIC_URL}/bower_components/jquery-knob/dist/jquery.knob.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/moment/min/moment.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/bootstrap-daterangepicker/daterangepicker.js`,
          `${process.env.PUBLIC_URL}/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js`,
          `${process.env.PUBLIC_URL}/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/jquery-slimscroll/jquery.slimscroll.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/fastclick/lib/fastclick.js`,
          `${process.env.PUBLIC_URL}/plugins/fileinput/fileinput.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/select2/dist/js/select2.full.min.js`,
          `${process.env.PUBLIC_URL}/bower_components/Chart.js/Chart.js`,
          `${process.env.PUBLIC_URL}/dist/js/adminlte.min.js`,
          `${process.env.PUBLIC_URL}/dist/js/demo.js`,
          "http://www.shieldui.com/shared/components/latest/js/shieldui-all.min.js",
          "http://www.shieldui.com/shared/components/latest/js/jszip.min.js",
          "https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.17.0.js",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js",
        ];

        for (const src of remainingScripts) {
          await loadScript(src);
        }
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();

    return () => {
      cssLinks.forEach((href) => {
        const link = document.querySelector(`link[to="${href}"]`);
        if (link) link.remove();
      });
    };
  }, []);

  return <div className="admin-layout">{children}</div>;
};

export default AdminLayout;
