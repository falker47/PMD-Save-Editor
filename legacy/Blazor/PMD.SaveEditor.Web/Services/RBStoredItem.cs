using System;
using System.Collections.Generic;
using System.Text;

namespace PMD.SaveEditor.Web.Services
{
    public class RBStoredItem
    {
        public RBStoredItem()
        {
        }

        public RBStoredItem(int itemID, int quantity)
        {
            ItemID = itemID;
            Quantity = quantity;
        }

        public int ItemID { get; set; }
        public int Quantity { get; set; }

        public override string ToString()
        {
            var itemName = Lists.RBItems.ContainsKey(ItemID) ? Lists.RBItems[ItemID] : string.Format(Language.UnknownItem, ItemID);
            return $"{itemName} ({Quantity})";
        }
    }
}
