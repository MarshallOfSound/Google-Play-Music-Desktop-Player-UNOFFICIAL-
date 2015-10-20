using System.Collections.Generic;
using System.Drawing;

namespace MaterialSkin
{
	public class ColorScheme
    {
        public readonly Color PrimaryColor, DarkPrimaryColor, LightPrimaryColor, AccentColor, TextColor;
        public readonly Pen PrimaryPen, DarkPrimaryPen, LightPrimaryPen, AccentPen, TextPen;
        public readonly Brush PrimaryBrush, DarkPrimaryBrush, LightPrimaryBrush, AccentBrush, TextBrush;
		
		/// <summary>
		/// Defines the Color Scheme to be used for all forms.
		/// </summary>
		/// <param name="primary">The primary color, a -500 color is suggested here.</param>
		/// <param name="darkPrimary">A darker version of the primary color, a -700 color is suggested here.</param>
		/// <param name="lightPrimary">A lighter version of the primary color, a -100 color is suggested here.</param>
		/// <param name="accent">The accent color, a -200 color is suggested here.</param>
		/// <param name="textShade">The text color, the one with the highest contrast is suggested.</param>
		public ColorScheme(Primary primary, Primary darkPrimary, Primary lightPrimary, Accent accent, TextShade textShade)
        {
            //Color
            PrimaryColor = ((int) primary).ToColor();
            DarkPrimaryColor = ((int) darkPrimary).ToColor();
            LightPrimaryColor = ((int) lightPrimary).ToColor();
            AccentColor = ((int) accent).ToColor();
			TextColor = ((int) textShade).ToColor();

            //Pen
            PrimaryPen = new Pen(PrimaryColor);
            DarkPrimaryPen = new Pen(DarkPrimaryColor);
            LightPrimaryPen = new Pen(LightPrimaryColor);
            AccentPen = new Pen(AccentColor);
            TextPen = new Pen(TextColor);

            //Brush
            PrimaryBrush = new SolidBrush(PrimaryColor);
            DarkPrimaryBrush = new SolidBrush(DarkPrimaryColor);
            LightPrimaryBrush = new SolidBrush(LightPrimaryColor);
            AccentBrush = new SolidBrush(AccentColor);
            TextBrush = new SolidBrush(TextColor);
        }
    }

    public static class ColorExtension
    {
        /// <summary>
        /// Convert an integer number to a Color.
        /// </summary>
        /// <returns></returns>
        public static Color ToColor(this int argb)
        {
            return Color.FromArgb(
                (argb & 0xff0000) >> 16,
                (argb & 0xff00) >> 8,
                 argb & 0xff);
        }

        /// <summary>
        /// Removes the alpha component of a color.
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public static Color RemoveAlpha(this Color color)
        {
            return Color.FromArgb(color.R, color.G, color.B);
        }

        /// <summary>
        /// Converts a 0-100 integer to a 0-255 color component.
        /// </summary>
        /// <param name="percentage"></param>
        /// <returns></returns>
        public static int PercentageToColorComponent(this int percentage)
        {
            return (int)((percentage / 100d) * 255d);
        }
    }

	//Color constantes
	public enum TextShade
	{
		WHITE = 0xFFFFFF,
		BLACK = 0x212121
	}

	public enum Primary
	{
		Red50 = 0xFFEBEE,
		Red100 = 0xFFCDD2,
		Red200 = 0xEF9A9A,
		Red300 = 0xE57373,
		Red400 = 0xEF5350,
		Red500 = 0xF44336,
		Red600 = 0xE53935,
		Red700 = 0xD32F2F,
		Red800 = 0xC62828,
		Red900 = 0xB71C1C,
		Pink50 = 0xFCE4EC,
		Pink100 = 0xF8BBD0,
		Pink200 = 0xF48FB1,
		Pink300 = 0xF06292,
		Pink400 = 0xEC407A,
		Pink500 = 0xE91E63,
		Pink600 = 0xD81B60,
		Pink700 = 0xC2185B,
		Pink800 = 0xAD1457,
		Pink900 = 0x880E4F,
		Purple50 = 0xF3E5F5,
		Purple100 = 0xE1BEE7,
		Purple200 = 0xCE93D8,
		Purple300 = 0xBA68C8,
		Purple400 = 0xAB47BC,
		Purple500 = 0x9C27B0,
		Purple600 = 0x8E24AA,
		Purple700 = 0x7B1FA2,
		Purple800 = 0x6A1B9A,
		Purple900 = 0x4A148C,
		DeepPurple50 = 0xEDE7F6,
		DeepPurple100 = 0xD1C4E9,
		DeepPurple200 = 0xB39DDB,
		DeepPurple300 = 0x9575CD,
		DeepPurple400 = 0x7E57C2,
		DeepPurple500 = 0x673AB7,
		DeepPurple600 = 0x5E35B1,
		DeepPurple700 = 0x512DA8,
		DeepPurple800 = 0x4527A0,
		DeepPurple900 = 0x311B92,
		Indigo50 = 0xE8EAF6,
		Indigo100 = 0xC5CAE9,
		Indigo200 = 0x9FA8DA,
		Indigo300 = 0x7986CB,
		Indigo400 = 0x5C6BC0,
		Indigo500 = 0x3F51B5,
		Indigo600 = 0x3949AB,
		Indigo700 = 0x303F9F,
		Indigo800 = 0x283593,
		Indigo900 = 0x1A237E,
		Blue50 = 0xE3F2FD,
		Blue100 = 0xBBDEFB,
		Blue200 = 0x90CAF9,
		Blue300 = 0x64B5F6,
		Blue400 = 0x42A5F5,
		Blue500 = 0x2196F3,
		Blue600 = 0x1E88E5,
		Blue700 = 0x1976D2,
		Blue800 = 0x1565C0,
		Blue900 = 0x0D47A1,
		LightBlue50 = 0xE1F5FE,
		LightBlue100 = 0xB3E5FC,
		LightBlue200 = 0x81D4FA,
		LightBlue300 = 0x4FC3F7,
		LightBlue400 = 0x29B6F6,
		LightBlue500 = 0x03A9F4,
		LightBlue600 = 0x039BE5,
		LightBlue700 = 0x0288D1,
		LightBlue800 = 0x0277BD,
		LightBlue900 = 0x01579B,
		Cyan50 = 0xE0F7FA,
		Cyan100 = 0xB2EBF2,
		Cyan200 = 0x80DEEA,
		Cyan300 = 0x4DD0E1,
		Cyan400 = 0x26C6DA,
		Cyan500 = 0x00BCD4,
		Cyan600 = 0x00ACC1,
		Cyan700 = 0x0097A7,
		Cyan800 = 0x00838F,
		Cyan900 = 0x006064,
		Teal50 = 0xE0F2F1,
		Teal100 = 0xB2DFDB,
		Teal200 = 0x80CBC4,
		Teal300 = 0x4DB6AC,
		Teal400 = 0x26A69A,
		Teal500 = 0x009688,
		Teal600 = 0x00897B,
		Teal700 = 0x00796B,
		Teal800 = 0x00695C,
		Teal900 = 0x004D40,
		Green50 = 0xE8F5E9,
		Green100 = 0xC8E6C9,
		Green200 = 0xA5D6A7,
		Green300 = 0x81C784,
		Green400 = 0x66BB6A,
		Green500 = 0x4CAF50,
		Green600 = 0x43A047,
		Green700 = 0x388E3C,
		Green800 = 0x2E7D32,
		Green900 = 0x1B5E20,
		LightGreen50 = 0xF1F8E9,
		LightGreen100 = 0xDCEDC8,
		LightGreen200 = 0xC5E1A5,
		LightGreen300 = 0xAED581,
		LightGreen400 = 0x9CCC65,
		LightGreen500 = 0x8BC34A,
		LightGreen600 = 0x7CB342,
		LightGreen700 = 0x689F38,
		LightGreen800 = 0x558B2F,
		LightGreen900 = 0x33691E,
		Lime50 = 0xF9FBE7,
		Lime100 = 0xF0F4C3,
		Lime200 = 0xE6EE9C,
		Lime300 = 0xDCE775,
		Lime400 = 0xD4E157,
		Lime500 = 0xCDDC39,
		Lime600 = 0xC0CA33,
		Lime700 = 0xAFB42B,
		Lime800 = 0x9E9D24,
		Lime900 = 0x827717,
		Yellow50 = 0xFFFDE7,
		Yellow100 = 0xFFF9C4,
		Yellow200 = 0xFFF59D,
		Yellow300 = 0xFFF176,
		Yellow400 = 0xFFEE58,
		Yellow500 = 0xFFEB3B,
		Yellow600 = 0xFDD835,
		Yellow700 = 0xFBC02D,
		Yellow800 = 0xF9A825,
		Yellow900 = 0xF57F17,
		Amber50 = 0xFFF8E1,
		Amber100 = 0xFFECB3,
		Amber200 = 0xFFE082,
		Amber300 = 0xFFD54F,
		Amber400 = 0xFFCA28,
		Amber500 = 0xFFC107,
		Amber600 = 0xFFB300,
		Amber700 = 0xFFA000,
		Amber800 = 0xFF8F00,
		Amber900 = 0xFF6F00,
		Orange50 = 0xFFF3E0,
		Orange100 = 0xFFE0B2,
		Orange200 = 0xFFCC80,
		Orange300 = 0xFFB74D,
		Orange400 = 0xFFA726,
		Orange500 = 0xFF9800,
		Orange600 = 0xFB8C00,
		Orange700 = 0xF57C00,
		Orange800 = 0xEF6C00,
		Orange900 = 0xE65100,
		DeepOrange50 = 0xFBE9E7,
		DeepOrange100 = 0xFFCCBC,
		DeepOrange200 = 0xFFAB91,
		DeepOrange300 = 0xFF8A65,
		DeepOrange400 = 0xFF7043,
		DeepOrange500 = 0xFF5722,
		DeepOrange600 = 0xF4511E,
		DeepOrange700 = 0xE64A19,
		DeepOrange800 = 0xD84315,
		DeepOrange900 = 0xBF360C,
		Brown50 = 0xEFEBE9,
		Brown100 = 0xD7CCC8,
		Brown200 = 0xBCAAA4,
		Brown300 = 0xA1887F,
		Brown400 = 0x8D6E63,
		Brown500 = 0x795548,
		Brown600 = 0x6D4C41,
		Brown700 = 0x5D4037,
		Brown800 = 0x4E342E,
		Brown900 = 0x3E2723,
		Grey50 = 0xFAFAFA,
		Grey100 = 0xF5F5F5,
		Grey200 = 0xEEEEEE,
		Grey300 = 0xE0E0E0,
		Grey400 = 0xBDBDBD,
		Grey500 = 0x9E9E9E,
		Grey600 = 0x757575,
		Grey700 = 0x616161,
		Grey800 = 0x424242,
		Grey900 = 0x212121,
		BlueGrey50 = 0xECEFF1,
		BlueGrey100 = 0xCFD8DC,
		BlueGrey200 = 0xB0BEC5,
		BlueGrey300 = 0x90A4AE,
		BlueGrey400 = 0x78909C,
		BlueGrey500 = 0x607D8B,
		BlueGrey600 = 0x546E7A,
		BlueGrey700 = 0x455A64,
		BlueGrey800 = 0x37474F,
		BlueGrey900 = 0x263238,
		
	}

	public enum Accent
	{
		Red100 = 0xFF8A80,
		Red200 = 0xFF5252,
		Red400 = 0xFF1744,
		Red700 = 0xD50000,
		Pink100 = 0xFF80AB,
		Pink200 = 0xFF4081,
		Pink400 = 0xF50057,
		Pink700 = 0xC51162,
		Purple100 = 0xEA80FC,
		Purple200 = 0xE040FB,
		Purple400 = 0xD500F9,
		Purple700 = 0xAA00FF,
		DeepPurple100 = 0xB388FF,
		DeepPurple200 = 0x7C4DFF,
		DeepPurple400 = 0x651FFF,
		DeepPurple700 = 0x6200EA,
		Indigo100 = 0x8C9EFF,
		Indigo200 = 0x536DFE,
		Indigo400 = 0x3D5AFE,
		Indigo700 = 0x304FFE,
		Blue100 = 0x82B1FF,
		Blue200 = 0x448AFF,
		Blue400 = 0x2979FF,
		Blue700 = 0x2962FF,
		LightBlue100 = 0x80D8FF,
		LightBlue200 = 0x40C4FF,
		LightBlue400 = 0x00B0FF,
		LightBlue700 = 0x0091EA,
		Cyan100 = 0x84FFFF,
		Cyan200 = 0x18FFFF,
		Cyan400 = 0x00E5FF,
		Cyan700 = 0x00B8D4,
		Teal100 = 0xA7FFEB,
		Teal200 = 0x64FFDA,
		Teal400 = 0x1DE9B6,
		Teal700 = 0x00BFA5,
		Green100 = 0xB9F6CA,
		Green200 = 0x69F0AE,
		Green400 = 0x00E676,
		Green700 = 0x00C853,
		LightGreen100 = 0xCCFF90,
		LightGreen200 = 0xB2FF59,
		LightGreen400 = 0x76FF03,
		LightGreen700 = 0x64DD17,
		Lime100 = 0xF4FF81,
		Lime200 = 0xEEFF41,
		Lime400 = 0xC6FF00,
		Lime700 = 0xAEEA00,
		Yellow100 = 0xFFFF8D,
		Yellow200 = 0xFFFF00,
		Yellow400 = 0xFFEA00,
		Yellow700 = 0xFFD600,
		Amber100 = 0xFFE57F,
		Amber200 = 0xFFD740,
		Amber400 = 0xFFC400,
		Amber700 = 0xFFAB00,
		Orange100 = 0xFFD180,
		Orange200 = 0xFFAB40,
		Orange400 = 0xFF9100,
		Orange700 = 0xFF6D00,
		DeepOrange100 = 0xFF9E80,
		DeepOrange200 = 0xFF6E40,
		DeepOrange400 = 0xFF3D00,
		DeepOrange700 = 0xDD2C00,
	}
}
