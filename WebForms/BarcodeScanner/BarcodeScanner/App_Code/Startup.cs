using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BarcodeScanner.Startup))]
namespace BarcodeScanner
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
