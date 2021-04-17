$( function() {
    if( mw.config.get( "wgNamespaceNumber" ) < 0 ) return;
    mw.loader.using( [ "mediawiki.util", "mediawiki.api" ] ).then( function () {
        var link = mw.util.addPortletLink(
            "p-cactions",
            "#",
            "Undo last edit",
            "ca-undo",
            "Using the API, undo the last edit made to this page."
            );
        if( !link ) return;
        link.addEventListener( "click", function () {
            var api = new mw.Api();
            api.get( {
                prop: 'revisions',
                rvprop: 'content',
                rvlimit: 2,
                titles: mw.config.get( "wgPageName" )
            } ).done( function ( data ) {
                if ( !data.query || !data.query.pages ) return;
                var pageid = Object.getOwnPropertyNames( data.query.pages )[0],
                    text = data.query.pages[pageid].revisions[1]["*"];
                api.postWithToken( "csrf", {
                    action: "edit",
                    title: mw.config.get( "wgPageName" ),
                    summary: "Undoing last edit (using [[User:JJPMaster/nrr2.js|non-rollback-rollback]])",
                    text: text
                } ).done ( function ( data ) {
                    if ( data && data.edit && data.edit.result && data.edit.result == 'Success' ) {
                        mw.notify( "Undid last edit successfully! Reloading..." );
                        document.location.reload( true );
                    }
                } );
            } );
        } );
    } );
} );
