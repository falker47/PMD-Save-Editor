using System.Linq;

namespace PMD.SaveEditor.Web.Services
{
    public class SkyHeldItem : ExplorersItem
    {
        public SkyHeldItem()
        {
            IsValid = true;
        }

        public SkyHeldItem(int id, int parameter) : base(id, parameter)
        {
            IsValid = true;
        }

        public SkyHeldItem(BitBlock bits)
        { 
            IsValid = bits[0];
            Flag1 = bits[1];
            Flag2 = bits[2];
            Flag3 = bits[3];
            Flag4 = bits[4];
            Flag5 = bits[5];
            Flag6 = bits[6];
            Flag7 = bits[7];
            Parameter = bits.GetInt(0, 8, 11);
            ID = bits.GetInt(0, 19, 11);
            Holder = (ItemHolder)bits.GetInt(0, 30, 3);
        }

        public BitBlock ToBitBlock()
        {
            var bits = new BitBlock(33);
            bits[0] = IsValid;
            bits[1] = Flag1;
            bits[2] = Flag2;
            bits[3] = Flag3;
            bits[4] = Flag4;
            bits[5] = Flag5;
            bits[6] = Flag6;
            bits[7] = Flag7;

            bits.SetInt(0, 8, 11, Parameter);
            bits.SetInt(0, 19, 11, ID);
            bits.SetInt(0, 30, 3, (int)Holder);

            return bits;
        }

        public bool IsValid { get; set; }
        public bool Flag1 { get; set; }
        public bool Flag2 { get; set; }
        public bool Flag3 { get; set; }
        public bool Flag4 { get; set; }
        public bool Flag5 { get; set; }
        public bool Flag6 { get; set; }
        public bool Flag7 { get; set; }
        public ItemHolder Holder { get; set; }
    }
}
