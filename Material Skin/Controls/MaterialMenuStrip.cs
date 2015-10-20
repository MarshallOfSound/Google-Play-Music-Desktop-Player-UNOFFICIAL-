using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MaterialSkin.Controls
{
	public class MaterialMenuStrip : MenuStrip, IMaterialControl
	{
		public int Depth { get; set; }
		public MaterialSkinManager SkinManager { get { return MaterialSkinManager.Instance; } }
		public MouseState MouseState { get; set; }

		public MaterialMenuStrip()
		{
			Renderer = new MaterialMenuStripRender();

			if (DesignMode)
			{
				Dock = DockStyle.None;
				Anchor |= AnchorStyles.Right;
				AutoSize = false;
				Location = new Point(0, 28);
			}
		}
		
		protected override void OnCreateControl()
		{
			base.OnCreateControl();
			Font = SkinManager.ROBOTO_MEDIUM_10;
			BackColor = SkinManager.PrimaryColor;
		}
	}

	internal class MaterialMenuStripRender : ToolStripProfessionalRenderer, IMaterialControl
	{
		//Properties for managing the material design properties
		public int Depth { get; set; }
		public MaterialSkinManager SkinManager { get { return MaterialSkinManager.Instance; } }
		public MouseState MouseState { get; set; }

		protected override void OnRenderItemText(ToolStripItemTextRenderEventArgs e)
		{
			var g = e.Graphics;
			g.TextRenderingHint = TextRenderingHint.AntiAlias;

			if (e.Item.IsOnDropDown)
			{
				var itemRect = GetItemRect(e.Item);
				var textRect = new Rectangle(24, itemRect.Y, itemRect.Width - (24 + 16), itemRect.Height);
				g.DrawString(e.Text, SkinManager.ROBOTO_MEDIUM_10, e.Item.Enabled ? SkinManager.GetMainTextBrush() : SkinManager.GetDisabledOrHintBrush(), textRect, new StringFormat() { LineAlignment = StringAlignment.Center });
			}
			else
			{
				g.DrawString(e.Text, SkinManager.ROBOTO_MEDIUM_10, Brushes.White, e.TextRectangle, new StringFormat() { LineAlignment = StringAlignment.Center });
			}
		}

		protected override void OnRenderMenuItemBackground(ToolStripItemRenderEventArgs e)
		{
			var g = e.Graphics;
			g.Clear(SkinManager.PrimaryColor);

			//Draw background
			var itemRect = GetItemRect(e.Item);
			if (e.Item.IsOnDropDown)
			{
				g.FillRectangle(e.Item.Selected && e.Item.Enabled ? SkinManager.GetCmsSelectedItemBrush() : new SolidBrush(SkinManager.GetApplicationBackgroundColor()), itemRect);
			}
			else
			{
				g.FillRectangle(e.Item.Selected ? SkinManager.GetFlatButtonPressedBackgroundBrush() : SkinManager.PrimaryColorBrush, itemRect);
			}

			//Ripple animation
			var toolStrip = e.ToolStrip as MaterialContextMenuStrip;
			if (toolStrip != null)
			{
				var animationManager = toolStrip.animationManager;
				var animationSource = toolStrip.animationSource;
				if (toolStrip.animationManager.IsAnimating() && e.Item.Bounds.Contains(animationSource))
				{
					for (int i = 0; i < animationManager.GetAnimationCount(); i++)
					{
						var animationValue = animationManager.GetProgress(i);
						var rippleBrush = new SolidBrush(Color.FromArgb((int)(51 - (animationValue * 50)), Color.Black));
						var rippleSize = (int)(animationValue * itemRect.Width * 2.5);
						g.FillEllipse(rippleBrush, new Rectangle(animationSource.X - rippleSize / 2, itemRect.Y - itemRect.Height, rippleSize, itemRect.Height * 3));
					}
				}
			}
		}

		protected override void OnRenderImageMargin(ToolStripRenderEventArgs e)
		{
			//base.OnRenderImageMargin(e);
		}

		protected override void OnRenderSeparator(ToolStripSeparatorRenderEventArgs e)
		{
			var g = e.Graphics;

			g.FillRectangle(new SolidBrush(SkinManager.GetApplicationBackgroundColor()), e.Item.Bounds);
			g.DrawLine(new Pen(SkinManager.GetDividersColor()), new Point(e.Item.Bounds.Left, e.Item.Bounds.Height / 2), new Point(e.Item.Bounds.Right, e.Item.Bounds.Height / 2));
		}

		protected override void OnRenderToolStripBorder(ToolStripRenderEventArgs e)
		{
			//var g = e.Graphics;

			//g.DrawRectangle(new Pen(SkinManager.GetDividersColor()), new Rectangle(e.AffectedBounds.X, e.AffectedBounds.Y, e.AffectedBounds.Width - 1, e.AffectedBounds.Height - 1));
		}

		protected override void OnRenderArrow(ToolStripArrowRenderEventArgs e)
		{
			var g = e.Graphics;
			const int ARROW_SIZE = 4;

			var arrowMiddle = new Point(e.ArrowRectangle.X + e.ArrowRectangle.Width / 2, e.ArrowRectangle.Y + e.ArrowRectangle.Height / 2);
			var arrowBrush = e.Item.Enabled ? SkinManager.GetMainTextBrush() : SkinManager.GetDisabledOrHintBrush();
			using (var arrowPath = new GraphicsPath())
			{
				arrowPath.AddLines(new[] { new Point(arrowMiddle.X - ARROW_SIZE, arrowMiddle.Y - ARROW_SIZE), new Point(arrowMiddle.X, arrowMiddle.Y), new Point(arrowMiddle.X - ARROW_SIZE, arrowMiddle.Y + ARROW_SIZE) });
				arrowPath.CloseFigure();

				g.FillPath(arrowBrush, arrowPath);
			}
		}

		private Rectangle GetItemRect(ToolStripItem item)
		{
			return new Rectangle(0, item.ContentRectangle.Y, item.ContentRectangle.Width + 4, item.ContentRectangle.Height);
		}
	}
}
