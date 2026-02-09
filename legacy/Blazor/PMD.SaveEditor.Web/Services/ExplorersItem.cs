namespace PMD.SaveEditor.Web.Services
{
    public class ExplorersItem
    {
        public ExplorersItem()
        {
        }

        public ExplorersItem(int id, int parameter)
        {            
            ID = id;
            Parameter = parameter;
        }

        public int ID { get; set; }
        public int Parameter { get; set; }

        public bool IsBox => ID >= 364 && ID <= 399;
        public bool IsUsedTM => ID == 187;
        public bool IsStackableItem => ID >= 1 && ID <= 9;

        public int Quantity
        {
            get => IsStackableItem ? Math.Clamp(Parameter, 0, 127) : 1;
            set { if (IsStackableItem) Parameter = value; }
        }

        public int ContainedItemID
        {
            get
            {
                if (IsUsedTM) return Parameter + 188;
                if (IsBox) return Parameter;
                return 0;
            }
            set
            {
                if (IsUsedTM) Parameter = value - 188;
                else if (IsBox) Parameter = value;
            }
        }
    }
}
