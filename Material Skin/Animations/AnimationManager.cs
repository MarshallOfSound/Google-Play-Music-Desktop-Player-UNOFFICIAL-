using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace MaterialSkin.Animations
{
    class AnimationManager
    {
        public bool InterruptAnimation { get; set; }
        public double Increment { get; set; }
        public double SecondaryIncrement { get; set; }
        public AnimationType AnimationType { get; set; }
        public bool Singular { get; set; }

        public delegate void AnimationFinished(object sender);
        public event AnimationFinished OnAnimationFinished;

        public delegate void AnimationProgress(object sender);
        public event AnimationProgress OnAnimationProgress;

        private readonly List<double> animationProgresses;
        private readonly List<Point> animationSources;
        private readonly List<AnimationDirection> animationDirections;
        private readonly List<object[]> animationDatas;

        private const double MIN_VALUE = 0.00;
        private const double MAX_VALUE = 1.00;

        private readonly Timer animationTimer = new Timer { Interval = 5, Enabled = false };

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="singular">If true, only one animation is supported. The current animation will be replaced with the new one. If false, a new anmation is added to the list.</param>
        public AnimationManager(bool singular = true)
        {
            animationProgresses = new List<double>();
            animationSources = new List<Point>();
            animationDirections = new List<AnimationDirection>();
            animationDatas = new List<object[]>();

            Increment = 0.03;
            SecondaryIncrement = 0.03;
            AnimationType = AnimationType.Linear;
            InterruptAnimation = true;
            Singular = singular;

            if (Singular)
            {
                animationProgresses.Add(0);
                animationSources.Add(new Point(0, 0));
                animationDirections.Add(AnimationDirection.In);
            }

            animationTimer.Tick += AnimationTimerOnTick;
        }

        private void AnimationTimerOnTick(object sender, EventArgs eventArgs)
        {
            for (int i = 0; i < animationProgresses.Count; i++)
            {
                UpdateProgress(i);

                if (!Singular)
                {
                    if ((animationDirections[i] == AnimationDirection.InOutIn && animationProgresses[i] == MAX_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutOut;
                    }
                    else if ((animationDirections[i] == AnimationDirection.InOutRepeatingIn && animationProgresses[i] == MIN_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutRepeatingOut;
                    }
                    else if ((animationDirections[i] == AnimationDirection.InOutRepeatingOut && animationProgresses[i] == MIN_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutRepeatingIn;
                    }
                    else if (
                        (animationDirections[i] == AnimationDirection.In && animationProgresses[i] == MAX_VALUE) ||
                        (animationDirections[i] == AnimationDirection.Out && animationProgresses[i] == MIN_VALUE) ||
                        (animationDirections[i] == AnimationDirection.InOutOut && animationProgresses[i] == MIN_VALUE))
                    {
                        animationProgresses.RemoveAt(i);
                        animationSources.RemoveAt(i);
                        animationDirections.RemoveAt(i);
                        animationDatas.RemoveAt(i);
                    }
                }
                else
                {
                    if ((animationDirections[i] == AnimationDirection.InOutIn && animationProgresses[i] == MAX_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutOut;
                    }
                    else if ((animationDirections[i] == AnimationDirection.InOutRepeatingIn && animationProgresses[i] == MAX_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutRepeatingOut;
                    }
                    else if ((animationDirections[i] == AnimationDirection.InOutRepeatingOut && animationProgresses[i] == MIN_VALUE))
                    {
                        animationDirections[i] = AnimationDirection.InOutRepeatingIn;
                    }
                }
            }

            if (OnAnimationProgress != null)
            {
                OnAnimationProgress(this);
            }
        }

        public bool IsAnimating()
        {
            return animationTimer.Enabled;
        }

        public void StartNewAnimation(AnimationDirection animationDirection, object[] data = null)
        {
            StartNewAnimation(animationDirection, new Point(0, 0), data);
        }

        public void StartNewAnimation(AnimationDirection animationDirection, Point animationSource, object[] data = null)
        {
            if (!IsAnimating() || InterruptAnimation)
            {
                if (Singular && animationDirections.Count > 0)
                {
                    animationDirections[0] = animationDirection;
                }
                else
                {
                    animationDirections.Add(animationDirection);
                }

                if (Singular && animationSources.Count > 0)
                {
                    animationSources[0] = animationSource;
                }
                else
                {
                    animationSources.Add(animationSource);
                }

                if (!(Singular && animationProgresses.Count > 0))
                {
                    switch (animationDirections[animationDirections.Count - 1])
                    {
                        case AnimationDirection.InOutRepeatingIn:
                        case AnimationDirection.InOutIn:
                        case AnimationDirection.In:
                            animationProgresses.Add(MIN_VALUE);
                            break;
                        case AnimationDirection.InOutRepeatingOut:
                        case AnimationDirection.InOutOut:
                        case AnimationDirection.Out:
                            animationProgresses.Add(MAX_VALUE);
                            break;
                        default:
                            throw new Exception("Invalid AnimationDirection");
                    }
                }

                if (Singular && animationDatas.Count > 0)
                {
                    animationDatas[0] = data ?? new object[] { };
                }
                else
                {
                    animationDatas.Add(data ?? new object[] { });
                }

            }

            animationTimer.Start();
        }

        public void UpdateProgress(int index)
        {
            switch (animationDirections[index])
            {
                case AnimationDirection.InOutRepeatingIn:
                case AnimationDirection.InOutIn:
                case AnimationDirection.In:
                    IncrementProgress(index);
                    break;
                case AnimationDirection.InOutRepeatingOut:
                case AnimationDirection.InOutOut:
                case AnimationDirection.Out:
                    DecrementProgress(index);
                    break;
                default:
                    throw new Exception("No AnimationDirection has been set");
            }
        }

        private void IncrementProgress(int index)
        {
            animationProgresses[index] += Increment;
            if (animationProgresses[index] > MAX_VALUE)
            {
                animationProgresses[index] = MAX_VALUE;

                for (int i = 0; i < GetAnimationCount(); i++)
                {
                    if (animationDirections[i] == AnimationDirection.InOutIn) return;
                    if (animationDirections[i] == AnimationDirection.InOutRepeatingIn) return;
                    if (animationDirections[i] == AnimationDirection.InOutRepeatingOut) return;
                    if (animationDirections[i] == AnimationDirection.InOutOut && animationProgresses[i] != MAX_VALUE) return;
                    if (animationDirections[i] == AnimationDirection.In && animationProgresses[i] != MAX_VALUE) return;
                }
                
                animationTimer.Stop();
                if (OnAnimationFinished != null) OnAnimationFinished(this);
            }
        }

        private void DecrementProgress(int index)
        {
            animationProgresses[index] -= (animationDirections[index] == AnimationDirection.InOutOut || animationDirections[index] == AnimationDirection.InOutRepeatingOut) ? SecondaryIncrement : Increment;
            if (animationProgresses[index] < MIN_VALUE)
            {
                animationProgresses[index] = MIN_VALUE;

                for (int i = 0; i < GetAnimationCount(); i++)
                {
                    if (animationDirections[i] == AnimationDirection.InOutIn) return;
                    if (animationDirections[i] == AnimationDirection.InOutRepeatingIn) return;
                    if (animationDirections[i] == AnimationDirection.InOutRepeatingOut) return;
                    if (animationDirections[i] == AnimationDirection.InOutOut && animationProgresses[i] != MIN_VALUE) return;
                    if (animationDirections[i] == AnimationDirection.Out && animationProgresses[i] != MIN_VALUE) return;
                }

                animationTimer.Stop();
                if (OnAnimationFinished != null) OnAnimationFinished(this);
            }
        }

        public double GetProgress()
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationProgresses.Count == 0)
                throw new Exception("Invalid animation");

            return GetProgress(0);
        }

        public double GetProgress(int index)
        {
            if (!(index < GetAnimationCount()))
                throw new IndexOutOfRangeException("Invalid animation index");

            switch (AnimationType)
            {
                case AnimationType.Linear:
                    return AnimationLinear.CalculateProgress(animationProgresses[index]);
                case AnimationType.EaseInOut:
                    return AnimationEaseInOut.CalculateProgress(animationProgresses[index]);
                case AnimationType.EaseOut:
                    return AnimationEaseOut.CalculateProgress(animationProgresses[index]);
                case AnimationType.CustomQuadratic:
                    return AnimationCustomQuadratic.CalculateProgress(animationProgresses[index]);
                default:
                    throw new NotImplementedException("The given AnimationType is not implemented");
            }

        }

        public Point GetSource(int index)
        {
            if (!(index < GetAnimationCount()))
                throw new IndexOutOfRangeException("Invalid animation index");

            return animationSources[index];
        }

        public Point GetSource()
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationSources.Count == 0)
                throw new Exception("Invalid animation");

            return animationSources[0];
        }

        public AnimationDirection GetDirection()
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationDirections.Count == 0)
                throw new Exception("Invalid animation");

            return animationDirections[0];
        }

        public AnimationDirection GetDirection(int index)
        {
            if (!(index < animationDirections.Count))
                throw new IndexOutOfRangeException("Invalid animation index");

            return animationDirections[index];
        }

        public object[] GetData()
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationDatas.Count == 0)
                throw new Exception("Invalid animation");

            return animationDatas[0];
        }

        public object[] GetData(int index)
        {
            if (!(index < animationDatas.Count))
                throw new IndexOutOfRangeException("Invalid animation index");

            return animationDatas[index];
        }

        public int GetAnimationCount()
        {
            return animationProgresses.Count;
        }

        public void SetProgress(double progress)
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationProgresses.Count == 0)
                throw new Exception("Invalid animation");

            animationProgresses[0] = progress;
        }

        public void SetDirection(AnimationDirection direction)
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationProgresses.Count == 0)
                throw new Exception("Invalid animation");

            animationDirections[0] = direction;
        }

        public void SetData(object[] data)
        {
            if (!Singular)
                throw new Exception("Animation is not set to Singular.");

            if (animationDatas.Count == 0)
                throw new Exception("Invalid animation");

            animationDatas[0] = data;
        }
    }
}
